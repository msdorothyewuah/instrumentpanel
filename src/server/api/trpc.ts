// src/server/api/trpc.ts

import { initTRPC } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

// Context type definition
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return {};
};

// Initialize tRPC
const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

// Export reusable router and procedure helpers
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;