import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generateNativePolish } from "../../services/native-polish-service";

export const polishRouter = router({
  generatePolish: publicProcedure
    .input(
      z.object({
        originalSentence: z.string(),
        correctedSentence: z.string(),
        gradeLevel: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const suggestion = await generateNativePolish(
        input.originalSentence,
        input.correctedSentence,
        input.gradeLevel
      );
      return suggestion;
    }),
});
