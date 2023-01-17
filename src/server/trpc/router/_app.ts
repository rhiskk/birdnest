import { router } from "../trpc";
import { violationRouter } from "./violation";

export const appRouter = router({
  violation: violationRouter,
});

export type AppRouter = typeof appRouter;
