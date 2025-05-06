// src/server/api/index.ts

import { createRouter } from './context';
import { workspaceRouter } from './routers/workspace';

export const appRouter = createRouter()
  .merge('workspace:', workspaceRouter);

export type AppRouter = typeof appRouter;