// src/hooks/workspaceQueries.ts
import { useQuery } from '@tanstack/react-query';
import workspaceApi from '../services/api';
import { 
  TimeRange, 
  WorkspaceAnalyticsFilters, 
  NewlyCreatedFilters,
  ActiveWorkspacesFilters,
  RecentWorkspacesFilters
} from '../types';

// Hook for getting all workspaces
export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: workspaceApi.getAllWorkspaces,
    // Refresh data every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
};

// Hook for getting analytics data
export const useWorkspaceAnalytics = (filters: WorkspaceAnalyticsFilters) => {
  return useQuery({
    // Include filters in the query key so it refreshes when filters change
    queryKey: ['workspace-analytics', filters],
    queryFn: () => workspaceApi.getAnalytics(filters),
    // Keep showing previous data while fetching new data
    keepPreviousData: true,
    // Refresh data every minute
    refetchInterval: 60 * 1000,
  });
};

// Hook for getting total workspace count
export const useWorkspaceCount = (eonid?: number) => {
  return useQuery({
    queryKey: ['workspace-count', { eonid }],
    queryFn: () => workspaceApi.getWorkspaceCount(eonid),
    refetchInterval: 60 * 1000,
  });
};

// Hook for getting newly created workspaces count
export const useNewlyCreatedCount = (filters: NewlyCreatedFilters = {}) => {
  return useQuery({
    queryKey: ['newly-created-count', filters],
    queryFn: () => workspaceApi.getNewlyCreatedCount(filters),
    refetchInterval: 60 * 1000,
  });
};

// Hook for getting active workspaces count
export const useActiveCount = (filters: ActiveWorkspacesFilters = {}) => {
  return useQuery({
    queryKey: ['active-count', filters],
    queryFn: () => workspaceApi.getActiveCount(filters),
    refetchInterval: 60 * 1000,
  });
};

// Hook for getting recently created workspaces
export const useRecentWorkspaces = (filters: RecentWorkspacesFilters = {}) => {
  return useQuery({
    queryKey: ['recent-workspaces', filters],
    queryFn: () => workspaceApi.getRecentWorkspaces(filters),
    refetchInterval: 60 * 1000,
  });
};

// Additional helper hook for all dashboard data with shared filters
export const useDashboardData = (
  timeRange: TimeRange = 'lastMonth',
  eonid?: number,
  activityDays: number = 45,
  newlyCreatedHours: number = 24
) => {
  // Get all workspaces for dropdown filters
  const workspacesQuery = useWorkspaces();
  
  // Get analytics data for chart
  const analyticsQuery = useWorkspaceAnalytics({
    range: timeRange,
    eonid,
  });
  
  // Get total workspace count
  const countQuery = useWorkspaceCount(eonid);
  
  // Get newly created workspaces count
  const newlyCreatedQuery = useNewlyCreatedCount({
    hours: newlyCreatedHours,
    eonid,
  });
  
  // Get active workspaces count
  const activeQuery = useActiveCount({
    days: activityDays,
    eonid,
  });
  
  // Get recent workspaces for table
  const recentQuery = useRecentWorkspaces({
    limit: 5,
    eonid,
  });
  
  // Combine loading states
  const isLoading = 
    workspacesQuery.isLoading || 
    analyticsQuery.isLoading || 
    countQuery.isLoading ||
    newlyCreatedQuery.isLoading ||
    activeQuery.isLoading ||
    recentQuery.isLoading;
  
  // Combine error states
  const error = 
    workspacesQuery.error || 
    analyticsQuery.error || 
    countQuery.error ||
    newlyCreatedQuery.error ||
    activeQuery.error ||
    recentQuery.error;
  
  // Return all query results and loading/error states
  return {
    workspaces: workspacesQuery.data || [],
    analyticsData: analyticsQuery.data || [],
    workspaceCount: countQuery.data || 0,
    newlyCreatedCount: newlyCreatedQuery.data || 0,
    activeCount: activeQuery.data || 0,
    recentWorkspaces: recentQuery.data || [],
    isLoading,
    isFetching: {
      workspaces: workspacesQuery.isFetching,
      analytics: analyticsQuery.isFetching,
      count: countQuery.isFetching,
      newlyCreated: newlyCreatedQuery.isFetching,
      active: activeQuery.isFetching,
      recent: recentQuery.isFetching,
    },
    error,
  };
};