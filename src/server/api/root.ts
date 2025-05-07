// src/server/api/root.ts

import { createTRPCRouter } from './trpc';
import { workspaceRouter } from './routers/workspace';

export const appRouter = createTRPCRouter({
  workspace: workspaceRouter,
});

export type AppRouter = typeof appRouter;