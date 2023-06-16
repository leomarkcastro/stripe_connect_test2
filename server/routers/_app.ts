import { router } from "../trpc";
import { authRouter } from "./auth";
import { stripeRouter } from "./stripe";
import { testRouter } from "./test";

export const appRouter = router({
  test: testRouter,
  auth: authRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
