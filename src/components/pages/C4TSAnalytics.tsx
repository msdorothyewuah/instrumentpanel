// src/pages/C4TSAnalytics.tsx
import React, { useMemo } from 'react'; // Removed useState
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import {
  fetchC4TSApiHitsOverTime,
  fetchC4TSTopEndpoints,
  fetchC4TSTopUsersChartData,
} from '../../services/apiService';
import { DataPoint, CategoricalChartData } from '../../types/analytics';
import { ApiEndpointData, ActiveFilters } from '../../types/common';

// Helper to format numbers (can be moved to a utils file)
const formatNumber = (num: number): string => num.toLocaleString();

// --- Placeholder Components (Simplified for this context) ---
// These would be your actual chart components.
// They no longer manage their own filter dropdowns for timeframe etc.
const LineChartPlaceholder: React.FC<{ title: string; data?: DataPoint[]; isLoading?: boolean; error?: Error | null; peakInfo?: string; currentFilters?: ActiveFilters }> =
 ({ title, data, isLoading, error, peakInfo, currentFilters }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      {/* Display current timeframe from global filters if needed */}
      {currentFilters && <span className="text-sm text-gray-500">Timeframe: {currentFilters.timeframe}</span>}
    </div>
    {isLoading && <p className="text-gray-500">Loading chart data...</p>}
    {error && <p className="text-red-500">Error: {error.message}</p>}
    {!isLoading && !error && data && (
      <div className="h-72 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center p-4 relative">
        <pre className="text-xs overflow-auto">Line Chart Data Loaded. Points: {data.length}</pre>
        {peakInfo && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-primary-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10"
                 style={{ marginLeft: '25%' }}>
                {peakInfo.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
        )}
      </div>
    )}
    {!isLoading && !error && !data && <p>No data available for the chart.</p>}
  </div>
);

const BarChartPlaceholder: React.FC<{ title: string; increase?: string; data?: CategoricalChartData[]; isLoading?: boolean; error?: Error | null; }> =
 ({ title, increase, data, isLoading, error }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      {increase && (
        <span className="text-sm font-medium text-green-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          {increase}
        </span>
      )}
    </div>
    {isLoading && <p className="text-gray-500">Loading chart data...</p>}
    {error && <p className="text-red-500">Error: {error.message}</p>}
    {!isLoading && !error && data && (
      <div className="h-72 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center p-4">
        <pre className="text-xs overflow-auto">Bar Chart Data Loaded. Bars: {data.length}</pre>
      </div>
    )}
     {!isLoading && !error && !data && <p>No data available for the chart.</p>}
  </div>
);
// --- End Placeholder Components ---


interface PageContextType {
  activeFilters: ActiveFilters;
}

const C4TSAnalytics: React.FC = () => {
  const outletContext = useOutletContext<PageContextType | null>();

  // Ensure activeFilters is available before using it
  const activeFilters = useMemo(() => {
    if (outletContext) {
      return outletContext.activeFilters;
    }
    // Return default filters or handle the case where context is not yet available
    // This might happen briefly on initial load or if context is not set up correctly.
    // For robustness, you might want a loading state or ensure Layout provides defaults.
    return {
      timeframe: 'all-time',
      department: 'ALL_DEPARTMENTS',
      region: 'ALL_REGIONS',
    } as ActiveFilters; // Fallback, ideally context is always there
  }, [outletContext]);


  // 1. Fetch API Hits Over Time (Line Chart)
  const {
    data: apiHitsData,
    isLoading: isLoadingApiHits,
    error: errorApiHits,
  } = useQuery<DataPoint[], Error>({
    queryKey: ['c4tsApiHits', activeFilters.timeframe, activeFilters.department, activeFilters.region],
    queryFn: () => fetchC4TSApiHitsOverTime(activeFilters),
    enabled: !!outletContext, // Only run query if context (and thus filters) is available
  });

  const peakApiHitInfo = useMemo(() => {
    if (apiHitsData && apiHitsData.length > 0) {
        const peakPoint = apiHitsData.find(p => p.date === 'Mar 23'); // Example for mock
        if (peakPoint) {
            return `${peakPoint.value} Hits\nMarch, 2025`;
        }
    }
    return undefined;
  }, [apiHitsData]);

  // 2. Fetch Top Users (Bar Chart)
  const {
    data: topUsersData,
    isLoading: isLoadingTopUsers,
    error: errorTopUsers,
  } = useQuery<CategoricalChartData[], Error>({
    queryKey: ['c4tsTopUsers', activeFilters.department, activeFilters.region], // Assuming department/region filters apply
    queryFn: () => fetchC4TSTopUsersChartData(activeFilters),
    enabled: !!outletContext,
  });
  // Note: The "3.5% Increase" is still hardcoded here. Needs dynamic data source.

  // 3. Fetch API Hits (URL) Table
  const {
    data: topEndpointsData,
    isLoading: isLoadingTopEndpoints,
    error: errorTopEndpoints,
  } = useQuery<ApiEndpointData[], Error>({
    queryKey: ['c4tsTopEndpoints', activeFilters.department, activeFilters.region], // Assuming department/region filters apply
    queryFn: () => fetchC4TSTopEndpoints(activeFilters),
    enabled: !!outletContext,
  });

  if (!outletContext) {
    // Optional: Render a loading state or null if context is not yet available
    // This depends on how quickly Layout provides the context.
    return <div className="p-6">Loading filters...</div>;
  }

  return (
    <div className="space-y-6">
      {/* API Hits Line Chart */}
      <LineChartPlaceholder
        title="API Hits"
        data={apiHitsData}
        isLoading={isLoadingApiHits}
        error={errorApiHits}
        peakInfo={peakApiHitInfo}
        currentFilters={activeFilters} // Pass current filters for display if needed
      />

      {/* Top Users Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div> {/* Empty div for layout adjustment as per screenshot */} </div>
        <BarChartPlaceholder
            title="TOP USERS"
            increase="3.5% Increase" // Hardcoded
            data={topUsersData}
            isLoading={isLoadingTopUsers}
            error={errorTopUsers}
        />
      </div>

      {/* API Hits (URL) Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">API Hits (URL)</h2>
          <button
            type="button"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            See All →
          </button>
        </div>
        {isLoadingTopEndpoints && <p className="p-6 text-gray-500">Loading API hits by URL...</p>}
        {errorTopEndpoints && <p className="p-6 text-red-500">Error: {errorTopEndpoints.message}</p>}
        {topEndpointsData && topEndpointsData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API URL</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Hits</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topEndpointsData.map((endpoint) => (
                  <tr key={endpoint.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{endpoint.url}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatNumber(endpoint.hits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {topEndpointsData && topEndpointsData.length === 0 && !isLoadingTopEndpoints &&(
          <p className="p-6 text-gray-500">No API hit data available.</p>
        )}
      </div>
    </div>
  );
};

export default C4TSAnalytics;