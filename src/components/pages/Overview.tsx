// src/pages/Overview.tsx
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import StatsCard from '../../components/dashboard/StatsCard';
import {
  fetchOverviewSummaryStats,
  fetchC4TSOverviewChartData,
  fetchStructurizrOverviewChartData,
  fetchTopUsersAcrossSystems,
} from '../../services/apiService';
import { OverviewSummaryStats, DataPoint } from '../../types/analytics';
import { UserData, StatsCardDisplayData, ActiveFilters } from '../../types/common';

// Helper to format numbers
const formatNumber = (num: number): string => num.toLocaleString();

// --- Placeholder Chart Component (Simplified) ---
const ChartPlaceholder: React.FC<{ title: string; data?: any; isLoading?: boolean; error?: Error | null; children?: React.ReactNode; viewDetailsLink?: string; currentFilters?: ActiveFilters }> =
 ({ title, isLoading, error, children, viewDetailsLink, currentFilters }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        {currentFilters && <span className="text-xs text-gray-400">Filters: {currentFilters.timeframe}, {currentFilters.department}, {currentFilters.region}</span>}
      </div>
      {viewDetailsLink && (
        <a href={viewDetailsLink} className="text-sm font-medium text-primary-600 hover:text-primary-500">
          View Details →
        </a>
      )}
    </div>
    {isLoading && <p className="text-gray-500">Loading chart data...</p>}
    {error && <p className="text-red-500">Error loading chart: {error.message}</p>}
    {!isLoading && !error && (
      children ? children : <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
        <p className="text-gray-500">Chart: Data to be displayed.</p>
      </div>
    )}
  </div>
);
// --- End Placeholder ---

interface PageContextType {
  activeFilters: ActiveFilters;
}

const Overview: React.FC = () => {
  const outletContext = useOutletContext<PageContextType | null>();

  const activeFilters = useMemo(() => {
    if (outletContext) {
      return outletContext.activeFilters;
    }
    return { // Fallback defaults
      timeframe: 'all-time',
      department: 'ALL_DEPARTMENTS',
      region: 'ALL_REGIONS',
    } as ActiveFilters;
  }, [outletContext]);

  // 1. Fetch Overview Summary Stats
  const {
    data: overviewStatsAPIData, // Renamed to avoid conflict with transformed data
    isLoading: isLoadingOverviewStats,
    error: errorOverviewStats,
  } = useQuery<OverviewSummaryStats, Error>({
    queryKey: ['overviewSummaryStats', activeFilters.timeframe, activeFilters.department, activeFilters.region],
    queryFn: () => fetchOverviewSummaryStats(activeFilters), // Pass activeFilters
    enabled: !!outletContext,
  });

  // Transform overviewStatsAPIData for the StatsCard component
  const statsForDisplay: StatsCardDisplayData[] = useMemo(() => {
    if (!overviewStatsAPIData) return [];
    return [
      {
        title: 'Total API Hits (C4TS)',
        value: formatNumber(overviewStatsAPIData.totalApiHits.value),
        trend: overviewStatsAPIData.totalApiHits.trend,
      },
      {
        title: 'Active Workspace (Structurizr)',
        value: formatNumber(overviewStatsAPIData.activeWorkspaces.value),
        trend: overviewStatsAPIData.activeWorkspaces.trend,
      },
      {
        title: 'Total Users',
        value: formatNumber(overviewStatsAPIData.totalUsers.value),
        trend: overviewStatsAPIData.totalUsers.trend,
      },
      {
        title: 'Total Departments',
        value: formatNumber(overviewStatsAPIData.totalDepartments.value),
        trend: overviewStatsAPIData.totalDepartments.trend,
      },
    ];
  }, [overviewStatsAPIData]);

  // 2. Fetch C4TS Overview Chart Data
  const {
    data: c4tsChartData,
    isLoading: isLoadingC4TSChart,
    error: errorC4TSChart,
  } = useQuery<{ seriesData: DataPoint[]; mostUsedEndpoint?: string; topUser?: string; }, Error>({
    queryKey: ['c4tsOverviewChart', activeFilters.timeframe, activeFilters.department, activeFilters.region],
    queryFn: () => fetchC4TSOverviewChartData(activeFilters), // Pass activeFilters
    enabled: !!outletContext,
  });

  // 3. Fetch Structurizr Overview Chart Data
  const {
    data: structurizrChartData,
    isLoading: isLoadingStructurizrChart,
    error: errorStructurizrChart,
  } = useQuery<{ seriesData: DataPoint[]; topUser?: string; }, Error>({
    queryKey: ['structurizrOverviewChart', activeFilters.timeframe, activeFilters.department, activeFilters.region],
    queryFn: () => fetchStructurizrOverviewChartData(activeFilters), // Pass activeFilters
    enabled: !!outletContext,
  });

  // 4. Fetch Top Users Across All Systems
  const {
    data: topUsersData,
    isLoading: isLoadingTopUsers,
    error: errorTopUsers,
  } = useQuery<UserData[], Error>({
    queryKey: ['topUsersAcrossSystems', activeFilters.timeframe, activeFilters.department, activeFilters.region],
    queryFn: () => fetchTopUsersAcrossSystems(activeFilters), // Pass activeFilters
    enabled: !!outletContext,
  });


  if (!outletContext) {
    return <div className="p-6">Loading filters...</div>;
  }
  // Main loading state for critical stats
  if (isLoadingOverviewStats) {
    return <div className="p-6">Loading dashboard overview...</div>;
  }
  if (errorOverviewStats) {
    return <div className="p-6 text-red-500">Error loading overview stats: {errorOverviewStats.message}</div>;
  }

  return (
    <div className="space-y-6">
      <StatsCard items={statsForDisplay} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          title="C4TS Analytics"
          isLoading={isLoadingC4TSChart}
          error={errorC4TSChart}
          viewDetailsLink="/c4ts"
          currentFilters={activeFilters}
        >
          {c4tsChartData && (
            <>
              <div className="h-64 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center p-4">
                <pre className="text-xs overflow-auto">
                  C4TS Chart. Series: {c4tsChartData.seriesData.length}.
                  Endpoint: {c4tsChartData.mostUsedEndpoint}. User: {c4tsChartData.topUser}
                </pre>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <p>Most Used Endpoint: <span className="font-medium text-gray-700">{c4tsChartData.mostUsedEndpoint || 'N/A'}</span></p>
                <p>Top User: <span className="font-medium text-gray-700">{c4tsChartData.topUser || 'N/A'}</span></p>
              </div>
            </>
          )}
        </ChartPlaceholder>

        <ChartPlaceholder
          title="Structurizr Analytics"
          isLoading={isLoadingStructurizrChart}
          error={errorStructurizrChart}
          viewDetailsLink="/structurizr"
          currentFilters={activeFilters}
        >
          {structurizrChartData && (
             <>
              <div className="h-64 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center p-4">
                 <pre className="text-xs overflow-auto">
                    Structurizr Chart. Series: {structurizrChartData.seriesData.length}.
                    User: {structurizrChartData.topUser}
                  </pre>
              </div>
              <div className="mt-4 flex justify-end text-sm text-gray-500">
                 <p>Top User: <span className="font-medium text-gray-700">{structurizrChartData.topUser || 'N/A'}</span></p>
              </div>
            </>
          )}
        </ChartPlaceholder>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Top Users Across All Systems</h2>
          <button
            type="button"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
            // onClick={() => navigate('/all-users-details')} // Example navigation
          >
            See All →
          </button>
        </div>
        {isLoadingTopUsers && <p className="p-6 text-gray-500">Loading top users...</p>}
        {errorTopUsers && <p className="p-6 text-red-500">Error loading top users: {errorTopUsers.message}</p>}
        {topUsersData && topUsersData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">C4TS API Hits</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Structurizr Workspaces</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topUsersData.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(user.c4tsApiHits || 0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(user.structurizrWorkspaces || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {topUsersData && topUsersData.length === 0 && !isLoadingTopUsers && (
          <p className="p-6 text-gray-500">No top user data available.</p>
        )}
      </div>
    </div>
  );
};

export default Overview;