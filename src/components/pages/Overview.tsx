// src/pages/Overview.tsx
import React, { useEffect } from 'react'; // Added useEffect for logging
import StatsCard from '../components/dashboard/StatsCard'; // Adjust path
import {
  useGetOverviewStats,
  useGetOverviewC4TSChartData,
  useGetOverviewStructurizrChartData,
  useGetOverviewTopUsersTable,
} from '../hooks/overviewQueries'; // Adjust path
import { FilterParams } from '../services/apiService'; // Adjust path

// Placeholder components for charts and tables
// You will replace these with your actual charting/table components
const C4TSChartPlaceholder: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
    <p className="text-gray-500">C4TS Chart (Data points: {data?.length || 0})</p>
  </div>
);

const StructurizrChartPlaceholder: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
    <p className="text-gray-500">Structurizr Chart (Data points: {data?.length || 0})</p>
  </div>
);

const UsersTablePlaceholder: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USER</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEPARTMENT</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">C4TS API HITS</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STRUCTURIZR WORKSPACES</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data?.map((user, index) => (
          <tr key={user.user || index}> {/* Use a stable key like user.id if available */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.user}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.c4tsApiHits}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.structurizrWorkspaces}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


interface OverviewPageProps {
  filters: FilterParams; // This prop will be injected by Layout.tsx
}

const Overview: React.FC<OverviewPageProps> = ({ filters }) => {
  // Log received filters for debugging
  useEffect(() => {
    console.log("Overview page received filters:", filters);
  }, [filters]);

  const { 
    data: statsItems, 
    isLoading: isLoadingStats, 
    isError: isErrorStats, 
    error: errorStats 
  } = useGetOverviewStats(filters);

  const { 
    data: c4tsChartData, 
    isLoading: isLoadingC4TSChart, 
    isError: isErrorC4TSChart, 
    error: errorC4TSChart 
  } = useGetOverviewC4TSChartData(filters);

  const { 
    data: structurizrChartData, 
    isLoading: isLoadingStructurizrChart, 
    isError: isErrorStructurizrChart, 
    error: errorStructurizrChart 
  } = useGetOverviewStructurizrChartData(filters);
  
  const { 
    data: topUsersTableData, 
    isLoading: isLoadingTopUsers, 
    isError: isErrorTopUsers, 
    error: errorTopUsers 
  } = useGetOverviewTopUsersTable(); // Top users table might not use page-level filters

  return (
    <div className="space-y-6">
      {/* Stats Cards Section */}
      <section aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">Statistics Overview</h2> {/* For accessibility */}
        {isLoadingStats && <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">Loading statistics...</div>}
        {isErrorStats && <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">Error loading statistics: {errorStats?.message}</div>}
        {statsItems && statsItems.length > 0 && <StatsCard items={statsItems} />}
        {statsItems && statsItems.length === 0 && !isLoadingStats && !isErrorStats && (
          <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">No statistics data available for the selected filters.</div>
        )}
      </section>

      {/* Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C4TS Analytics Chart Section */}
        <section aria-labelledby="c4ts-analytics-title" className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 id="c4ts-analytics-title" className="text-lg font-medium text-gray-900">C4TS Analytics</h2>
            <a href="/c4ts" className="text-primary-500 text-sm font-medium hover:text-primary-600">
              View Details →
            </a>
          </div>
          {isLoadingC4TSChart && <div className="h-64 flex items-center justify-center text-gray-500">Loading C4TS chart data...</div>}
          {isErrorC4TSChart && <div className="h-64 flex items-center justify-center text-red-500">Error loading C4TS chart: {errorC4TSChart?.message}</div>}
          {c4tsChartData && c4tsChartData.length > 0 && <C4TSChartPlaceholder data={c4tsChartData} />}
          {!isLoadingC4TSChart && !isErrorC4TSChart && (!c4tsChartData || c4tsChartData.length === 0) && (
            <div className="h-64 flex items-center justify-center text-gray-500">No C4TS chart data available for the selected filters.</div>
          )}
          {/* Static details below chart - consider making these dynamic too if needed */}
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Most Used Endpoint</p>
              <p className="font-medium">/translate</p> {/* Placeholder */}
            </div>
            <div>
              <p className="text-sm text-gray-500">Top User</p>
              <p className="font-medium">saakaray</p> {/* Placeholder */}
            </div>
          </div>
        </section>
        
        {/* Structurizr Analytics Chart Section */}
        <section aria-labelledby="structurizr-analytics-title" className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 id="structurizr-analytics-title" className="text-lg font-medium text-gray-900">Structurizr Analytics</h2>
            <a href="/structurizr" className="text-primary-500 text-sm font-medium hover:text-primary-600">
              View Details →
            </a>
          </div>
          {isLoadingStructurizrChart && <div className="h-64 flex items-center justify-center text-gray-500">Loading Structurizr chart data...</div>}
          {isErrorStructurizrChart && <div className="h-64 flex items-center justify-center text-red-500">Error loading Structurizr chart: {errorStructurizrChart?.message}</div>}
          {structurizrChartData && structurizrChartData.length > 0 && <StructurizrChartPlaceholder data={structurizrChartData} />}
          {!isLoadingStructurizrChart && !isErrorStructurizrChart && (!structurizrChartData || structurizrChartData.length === 0) && (
            <div className="h-64 flex items-center justify-center text-gray-500">No Structurizr chart data available for the selected filters.</div>
          )}
          {/* Static details below chart - consider making these dynamic too if needed */}
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Workspaces</p>
              <p className="font-medium">36</p> {/* Placeholder */}
            </div>
            <div>
              <p className="text-sm text-gray-500">Top User</p>
              <p className="font-medium">browjose</p> {/* Placeholder */}
            </div>
          </div>
        </section>
      </div>
      
      {/* Users Table Section */}
      <section aria-labelledby="top-users-title" className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 id="top-users-title" className="text-lg font-medium text-gray-900">Top Users Across All Systems</h2>
          <button className="text-primary-500 text-sm font-medium hover:text-primary-600">
            See All
          </button>
        </div>
        {isLoadingTopUsers && <div className="p-4 text-center text-gray-500">Loading top users data...</div>}
        {isErrorTopUsers && <div className="p-4 text-center text-red-500">Error loading top users: {errorTopUsers?.message}</div>}
        {topUsersTableData && topUsersTableData.length > 0 && <UsersTablePlaceholder data={topUsersTableData} />}
        {!isLoadingTopUsers && !isErrorTopUsers && (!topUsersTableDatar || topUsersTableData.length === 0) && (
          <div className="p-4 text-center text-gray-500">No top users data available.</div>
        )}
      </section>
    </div>
  );
};

export default Overview;