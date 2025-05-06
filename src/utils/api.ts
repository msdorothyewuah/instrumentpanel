// src/utils/api.ts

import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../server/api';

export const api = createReactQueryHooks<AppRouter>();