// src/api.ts
import axios from 'axios';
import {
  Workspace,
  C4Workspace,
  AnalyticsDataPoint,
  C4AnalyticsDataPoint,
  WorkspaceAnalyticsFilters,
  WorkspaceCountResponse,
  NewlyCreatedFilters,
  ActiveWorkspacesFilters,
  RecentWorkspacesFilters,
  C4WorkspaceFilters,
  TimeRange
} from './types';

// Create an axios instance - update the baseURL to your actual API URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Structurizr API methods
export const structurizrApi = {
  // Get all workspaces
  getAllWorkspaces: async (): Promise<Workspace[]> => {
    const response = await api.get<Workspace[]>('/structurizr/workspaces');
    return response.data;
  },

  // Get workspace analytics data
  getAnalytics: async (filters: WorkspaceAnalyticsFilters): Promise<AnalyticsDataPoint[]> => {
    const { range, eonid } = filters;
    const params = { range, ...(eonid ? { eonid } : {}) };
    const response = await api.get<AnalyticsDataPoint[]>('/structurizr/analytics', { params });
    return response.data;
  },

  // Get total workspace count
  getWorkspaceCount: async (eonid?: number): Promise<number> => {
    const params = eonid ? { eonid } : {};
    const response = await api.get<WorkspaceCountResponse>('/structurizr/count', { params });
    return response.data.count;
  },

  // Get newly created workspaces count
  getNewlyCreatedCount: async (filters: NewlyCreatedFilters = {}): Promise<number> => {
    const response = await api.get<WorkspaceCountResponse>('/structurizr/newly-created', { 
      params: filters 
    });
    return response.data.count;
  },

  // Get active workspaces count
  getActiveCount: async (filters: ActiveWorkspacesFilters = {}): Promise<number> => {
    const response = await api.get<WorkspaceCountResponse>('/structurizr/active', { 
      params: filters 
    });
    return response.data.count;
  },

  // Get recently created workspaces
  getRecentWorkspaces: async (filters: RecentWorkspacesFilters = {}): Promise<Workspace[]> => {
    const response = await api.get<Workspace[]>('/structurizr/recent', { 
      params: filters 
    });
    return response.data;
  }
};

// C4 Model API methods
export const c4Api = {
  // Get all C4 workspaces
  getAllWorkspaces: async (): Promise<C4Workspace[]> => {
    const response = await api.get<C4Workspace[]>('/c4/workspaces');
    return response.data;
  },

  // Get C4 workspace analytics
  getAnalytics: async (filters: C4WorkspaceFilters): Promise<C4AnalyticsDataPoint[]> => {
    const response = await api.get<C4AnalyticsDataPoint[]>('/c4/analytics', { 
      params: filters 
    });
    return response.data;
  },

  // Get total C4 workspace count
  getWorkspaceCount: async (owner?: string): Promise<number> => {
    const params = owner ? { owner } : {};
    const response = await api.get<WorkspaceCountResponse>('/c4/count', { params });
    return response.data.count;
  },

  // Get active C4 workspaces (by views)
  getMostViewedWorkspaces: async (limit: number = 5): Promise<C4Workspace[]> => {
    const response = await api.get<C4Workspace[]>('/c4/most-viewed', { 
      params: { limit } 
    });
    return response.data;
  },

  // Get recent C4 workspaces
  getRecentWorkspaces: async (limit: number = 5): Promise<C4Workspace[]> => {
    const response = await api.get<C4Workspace[]>('/c4/recent', { 
      params: { limit } 
    });
    return response.data;
  }
};