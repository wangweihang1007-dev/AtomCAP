import { createTRPCRouter, publicProcedure } from "./trpc";
import { projectRouter } from "./routers/project";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  healthCheck: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
