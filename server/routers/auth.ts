/**
 * Authentication Router - Handles Apple Sign In, Email Login/Register
 */

import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { verifyAppleToken } from "../services/apple-auth-service";
import { getUserByOpenId, upsertUser } from "../db";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  isValidEmail,
  validatePassword,
} from "../utils/auth";

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
   * 邮箱注册
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("邮箱格式不正确"),
        password: z.string().min(6, "密码长度至少6个字符"),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password, name } = input;

      // 验证邮箱格式
      if (!isValidEmail(email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "邮箱格式不正确",
        });
      }

      // 验证密码强度
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: passwordValidation.errors.join("；"),
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "数据库连接失败",
        });
      }

      // 检查邮箱是否已存在
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "该邮箱已被注册",
        });
      }

      // 哈希密码
      const passwordHash = await hashPassword(password);

      // 创建用户
      try {
        await db.insert(users).values({
          email,
          passwordHash,
          name: name || null,
          loginMethod: "email",
          lastSignedIn: new Date(),
        });

        return {
          success: true,
          message: "注册成功，请登录",
        };
      } catch (error) {
        console.error("[Auth] Registration error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "注册失败，请稍后重试",
        });
      }
    }),

  /**
   * 邮箱登录
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("邮箱格式不正确"),
        password: z.string().min(1, "密码不能为空"),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "数据库连接失败",
        });
      }

      // 查找用户
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "邮箱或密码错误",
        });
      }

      const user = result[0];

      // 检查是否有密码（邮箱注册用户）
      if (!user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "该邮箱未设置密码，请使用其他登录方式",
        });
      }

      // 验证密码
      const passwordMatch = await verifyPassword(password, user.passwordHash);
      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "邮箱或密码错误",
        });
      }

      // 更新最后登录时间
      try {
        await db
          .update(users)
          .set({ lastSignedIn: new Date() })
          .where(eq(users.id, user.id));
      } catch (error) {
        console.error("[Auth] Failed to update lastSignedIn:", error);
      }

      // 返回用户信息（不包括密码）
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        message: "登录成功",
      };
    }),

  /**
   * 检查邮箱是否已注册
   */
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { exists: false };
      }

      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      return {
        exists: result.length > 0,
      };
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
