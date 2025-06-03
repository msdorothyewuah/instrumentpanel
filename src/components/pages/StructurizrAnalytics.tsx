// src/pages/StructurizrAnalytics.tsx
import React, { useMemo } from 'react'; // Removed useState
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import {
  fetchStructurizrWorkspacesTrend,
  fetchStructurizrAccessMethods,
  fetchStructurizrTopUsersChartData,
  WorkspaceTrendDataPoint,
  AccessMethodData,
} from '../../services/apiService';
import { CategoricalChartData } from '../../types/analytics';
import { ActiveFilters } from '../../types/common';

// Helper to format numbers
const formatNumber = (num: number): string => num.toLocaleString();

// --- Placeholder Components (Simplified) ---
// These would be your actual chart components.
// They no longer manage their own filter dropdowns.

const MultiLineChartPlaceholder: React.FC<{ title: string; data?: WorkspaceTrendDataPoint[]; isLoading?: boolean; error?: Error | null; legendItems?: {name: string, color: string}[]; peakInfo?: string; currentFilters?: ActiveFilters }> =
 ({ title, data, isLoading, error, legendItems, peakInfo, currentFilters }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      {currentFilters && <span className="text-sm text-gray-500">Timeframe: {currentFilters.timeframe}</span>}
    </div>
    {isLoading && <p className="text-gray-500">Loading chart data...</p>}
    {error && <p className="text-red-500">Error: {error.message}</p>}
    {!isLoading && !error && data && (
      <>
        <div className="h-72 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center p-4 relative">
          <pre className="text-xs overflow-auto">Multi-Line Chart. Points: {data.length}</pre>
          {peakInfo && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-primary-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10"
                 style={{ marginLeft: '25%' }}>
                {peakInfo.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
           )}
        </div>
        {legendItems && (
          <div className="mt-4 flex justify-center space-x-4">
            {legendItems.map(item => (
              <div key={item.name} className="flex items-center">
                <span className={`h-3 w-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></span>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </>
    )}
    {!isLoading && !error && !data && <p>No data available for the chart.</p>}
  </div>
);

const DonutChartPlaceholder: React.FC<{ data?: AccessMethodData[]; isLoading?: boolean; error?: Error | null; }> =
 ({ data, isLoading, error }) => (
  <div className="h-full flex flex-col items-center justify-center">
    {isLoading && <p className="text-gray-500">Loading donut chart...</p>}
    {error && <p className="text-red-500">Error: {error.message}</p>}
    {!isLoading && !error && data && (
      <div className="w-48 h-48 border-8 border-dashed border-gray-300 rounded-full bg-gray-50 flex items-center justify-center p-4">
        <span className="text-xs text-gray-400">Donut</span>
      </div>
    )}
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
        <pre className="text-xs overflow-auto">Bar Chart. Bars: {data.length}</pre>
      </div>
    )}
    {!isLoading && !error && !data && <p>No data available for the chart.</p>}
  </div>
);
// --- End Placeholder Components ---

interface PageContextType {
  activeFilters: ActiveFilters;
}

const StructurizrAnalytics: React.FC = () => {
  const outletContext = useOutletContext<PageContextType | null>();

  const activeFilters = useMemo(() => {
    if (outletContext) {
      return outletContext.activeFilters;
    }
    return {
      timeframe: 'all-time',
      department: 'ALL_DEPARTMENTS',
      region: 'ALL_REGIONS',
    } as ActiveFilters; // Fallback
  }, [outletContext]);

  // 1. Fetch Structurizr Workspaces Trend (Multi-Line Chart)
  const {
    data: workspacesTrendData,
    isLoading: isLoadingWorkspacesTrend,
    error: errorWorkspacesTrend,
  } = useQuery<WorkspaceTrendDataPoint[], Error>({
    queryKey: ['structurizrWorkspacesTrend', activeFilters.timeframe, activeFilters.department, activeFilters.region],
    queryFn: () => fetchStructurizrWorkspacesTrend(activeFilters),
    enabled: !!outletContext,
  });

  const peakWorkspaceInfo = useMemo(() => {
    if (workspacesTrendData) {
        const mar23Data = workspacesTrendData.find(d => d.date === 'Mar 23');
        if (mar23Data) {
            return `March, 2025\nActive: 30\nCreated: 5\nDeleted: 2`; // From screenshot tooltip
        }
    }
    return undefined;
  }, [workspacesTrendData]);

  // 2. Fetch Workspace Access Methods (Donut Chart & Table)
  // This data typically isn't filtered by timeframe, but might be by department/region
  const {
    data: accessMethodsData,
    isLoading: isLoadingAccessMethods,
    error: errorAccessMethods,
  } = useQuery<AccessMethodData[], Error>({
    queryKey: ['structurizrAccessMethods', activeFilters.department, activeFilters.region], // Filter by dept/region
    queryFn: () => fetchStructurizrAccessMethods(activeFilters), // Pass activeFilters
    enabled: !!outletContext,
  });

  // 3. Fetch Top Users (Bar Chart)
  const {
    data: topUsersData,
    isLoading: isLoadingTopUsers,
    error: errorTopUsers,
  } = useQuery<CategoricalChartData[], Error>({
    queryKey: ['structurizrTopUsers', activeFilters.department, activeFilters.region], // Filter by dept/region
    queryFn: () => fetchStructurizrTopUsersChartData(activeFilters), // Pass activeFilters
    enabled: !!outletContext,
  });
  // Note: The "3.5% Increase" is still hardcoded.

  const workspaceLegend = [
    { name: 'Active', color: '#3b82f6' },
    { name: 'Created', color: '#22c55e' },
    { name: 'Deleted', color: '#ef4444' },
  ];

  if (!outletContext) {
    return <div className="p-6">Loading filters...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Structurizr Workspaces Multi-Line Chart */}
      <MultiLineChartPlaceholder
        title="Structurizr Workspaces"
        data={workspacesTrendData}
        isLoading={isLoadingWorkspacesTrend}
        error={errorWorkspacesTrend}
        legendItems={workspaceLegend}
        peakInfo={peakWorkspaceInfo}
        currentFilters={activeFilters}
      />

      {/* How workspaces are being accessed & Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Access Methods Donut Chart & Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">How workspaces are being accessed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <DonutChartPlaceholder
                data={accessMethodsData}
                isLoading={isLoadingAccessMethods}
                error={errorAccessMethods}
              />
            </div>
            <div className="md:col-span-2">
              {isLoadingAccessMethods && <p className="text-gray-500">Loading access methods...</p>}
              {errorAccessMethods && <p className="text-red-500">Error: {errorAccessMethods.message}</p>}
              {accessMethodsData && accessMethodsData.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="py-2 pr-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Name</th>
                        <th className="py-2 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Users</th>
                        <th className="py-2 pl-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {accessMethodsData.map((method) => (
                        <tr key={method.id}>
                          <td className="py-2 pr-2 whitespace-nowrap text-sm text-gray-900 flex items-center">
                            <span className={`h-2 w-2 rounded-full mr-2`} style={{ backgroundColor: method.color || '#ccc' }}></span>
                            {method.name}
                          </td>
                          <td className="py-2 px-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(method.users)}</td>
                          <td className="py-2 pl-2 whitespace-nowrap text-sm text-gray-500">{method.rate.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {accessMethodsData && accessMethodsData.length === 0 && !isLoadingAccessMethods &&(
                  <p className="text-gray-500">No access method data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Users Bar Chart */}
        <div className="lg:col-span-1">
          <BarChartPlaceholder
            title="TOP USERS"
            increase="3.5% Increase" // Hardcoded
            data={topUsersData}
            isLoading={isLoadingTopUsers}
            error={errorTopUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default StructurizrAnalytics;