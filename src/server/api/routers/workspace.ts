// src/server/api/routers/workspace.ts

import { createRouter } from '../context';
import { z } from 'zod';
import { 
  getWorkspaces, 
  getWorkspaceStats, 
  getTotalCount, 
  getRecentWorkspaces, 
  getActiveWorkspaces 
} from '../../db/models/workspace';

export const workspaceRouter = createRouter()
  .query('getAll', {
    async resolve() {
      return await getWorkspaces();
    }
  })
  .query('getActive', {
    async resolve() {
      return await getActiveWorkspaces();
    }
  })
  .query('getStats', {
    input: z.object({
      timeRange: z.enum(['day', 'week', 'month', 'quarter', 'year', 'all-time'])
    }),
    async resolve({ input }) {
      return await getWorkspaceStats(input.timeRange);
    }
  })
  .query('getTotalCount', {
    async resolve() {
      return await getTotalCount();
    }
  })
  .query('getRecentWorkspaces', {
    input: z.object({
      limit: z.number().default(5)
    }).optional(),
    async resolve({ input }) {
      return await getRecentWorkspaces(input?.limit);
    }
  });