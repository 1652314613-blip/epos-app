import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { grammarRouter } from "./routers/grammar";
import { practiceRouter } from "./routers/practice";
import { dictionaryRouter } from "./routers/dictionary";
import { textbookRouter } from "./routers/textbook";
import { ocrRouter } from "./routers/ocr";
import { smsRouter } from "./routers/sms";
import { polishRouter } from "./routers/polish";
import { authRouter } from "./routers/auth";
import { exerciseRouter } from "./routers/exercise";
import { qaRouter } from "./routers/qa";


export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    // Apple Sign In
    ...authRouter._def.procedures,
  }),

  // Grammar checking router
  grammar: grammarRouter,
  // Practice exercises router
  practice: practiceRouter,
  // Dictionary and vocabulary router
  dictionary: dictionaryRouter,
  // Textbook vocabulary router
  textbook: textbookRouter,
  // OCR text recognition router
  ocr: ocrRouter,
  // SMS verification code router
  sms: smsRouter,
  // Native polish router
  polish: polishRouter,
  // AI targeted exercise router
  exercise: exerciseRouter,
  // QA router for learning questions
  qa: qaRouter,

});

export type AppRouter = typeof appRouter;
