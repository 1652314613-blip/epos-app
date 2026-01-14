/**
 * Authentication Router - Handles Apple Sign In and other auth methods
 */

import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { verifyAppleToken } from "../services/apple-auth-service";
import { getUserByOpenId, upsertUser } from "../db";

export const authRouter = router({
  /**
   * Apple Sign In - Verify identity token and create/update user
   */
  appleSignIn: publicProcedure
    .input(
      z.object({
        identityToken: z.string(),
        user: z
          .object({
            email: z.string().email().optional(),
            name: z
              .object({
                firstName: z.string().optional(),
                lastName: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Verify the Apple identity token (JWT)
        const payload = await verifyAppleToken(input.identityToken);

        // Extract user info from token
        const appleUserId = payload.sub; // Apple's unique user ID
        const email = payload.email || input.user?.email;

        // Build full name from input (only provided on first sign-in)
        let name: string | null = null;
        if (input.user?.name) {
          const { firstName, lastName } = input.user.name;
          name = [firstName, lastName].filter(Boolean).join(" ") || null;
        }

        // Create or update user in database
        const lastSignedIn = new Date();
        await upsertUser({
          openId: `apple_${appleUserId}`, // Prefix to distinguish from other login methods
          name: name || null,
          email: email || null,
          loginMethod: "apple",
          lastSignedIn,
        });

        // Fetch the saved user
        const user = await getUserByOpenId(`apple_${appleUserId}`);

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });
        }

        // Return user info (session token should be handled by SDK if needed)
        return {
          success: true,
          user: {
            id: user.id,
            openId: user.openId,
            name: user.name,
            email: user.email,
            loginMethod: user.loginMethod,
            lastSignedIn: user.lastSignedIn?.toISOString(),
          },
        };
      } catch (error) {
        console.error("[Apple Sign In] Error:", error);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error instanceof Error ? error.message : "Apple Sign In failed",
        });
      }
    }),

  /**
   * Get current authenticated user
   */
  me: publicProcedure.query(async ({ ctx }) => {
    // This would typically use ctx.user from middleware
    // For now, return null if not implemented
    return { user: null };
  }),
});
