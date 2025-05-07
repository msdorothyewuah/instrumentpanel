// src/server/api/routers/workspace.ts

import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import WorkspaceDatabase from '../../database';

export const workspaceRouter = createTRPCRouter({
  getAllWorkspaces: publicProcedure
    .query(async () => {
      const db = await WorkspaceDatabase.connect();
      try {
        return await db.getAllWorkspaces();
      } finally {
        await db.close();
      }
    }),

  getAnalytics: publicProcedure
    .input(z.object({
      timeRange: z.enum(['day', 'week', 'month', 'quarter', 'year', 'all-time']),
    }))
    .query(async ({ input }) => {
      const db = await WorkspaceDatabase.connect();
      try {
        return await db.getWorkspaceAnalytics(input.timeRange);
      } finally {
        await db.close();
      }
    }),
    
  getWorkspaceCount: publicProcedure
    .query(async () => {
      const db = await WorkspaceDatabase.connect();
      try {
        return await db.getWorkspaceCount();
      } finally {
        await db.close();
      }
    }),

  getActiveWorkspaces: publicProcedure
    .input(z.object({
      days: z.number().default(30),
    }).optional())
    .query(async ({ input }) => {
      const db = await WorkspaceDatabase.connect();
      try {
        return await db.getActiveWorkspaces(input?.days);
      } finally {
        await db.close();
      }
    }),
});