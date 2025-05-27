// src/pages/StructurizrAnalytics.tsx
import React, { useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard'; // Adjust path
// Assuming WorkspaceChart is your Recharts component, or a similar one
import WorkspaceChart from '../components/dashboard/WorkspaceChart'; // Adjust path
import {
  useGetStructurizrPageStats,
  useGetStructurizrWorkspaceCreationChartData,
  useGetStructurizrAccessMethodsData,
  useGetStructurizrTopUsersChartData,
  // useGetRawStructurizrWorkspaces, // Uncomment if you need the raw list for something specific
} from '../hooks/structurizrQueries'; // Adjust path
import { FilterParams, StructurizrAccessMethod } from '../services/apiService'; // Adjust path

// Placeholder components if you don't have them yet
const AccessMethodsChartPlaceholder: React.FC<{ data: any }> = ({ data }) => ( // Assuming data might be for a doughnut/pie
  <div className="h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 mb-4">
    <p className="text-gray-500">Access Methods Chart (Data points: {data?.chartData?.length || 0})</p>
  </div>
);

const TopUsersBarChartPlaceholder: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
    <p className="text-gray-500">Top Users Bar Chart (Data points: {data?.length || 0})</p>
  </div>
);


interface StructurizrAnalyticsPageProps {
  filters: FilterParams; // Received from Layout.tsx
}

const StructurizrAnalytics: React.FC<StructurizrAnalyticsPageProps> = ({ filters }) => {
  useEffect(() => {
    console.log("StructurizrAnalytics page received filters:", filters);
  }, [filters]);

  const { 
    data: pageStats, 
    isLoading: isLoadingPageStats, 
    isError: isErrorPageStats, 
    error: errorPageStats 
  } = useGetStructurizrPageStats(filters);

  const { 
    data: workspaceCreationChartData, 
    isLoading: isLoadingWsCreationChart, 
    isError: isErrorWsCreationChart, 
    error: errorWsCreationChart 
  } = useGetStructurizrWorkspaceCreationChartData(filters);

  const { 
    data: accessMethodsData, 
    isLoading: isLoadingAccessMethods, 
    isError: isErrorAccessMethods, 
    error: errorAccessMethods 
  } = useGetStructurizrAccessMethodsData(); // Assuming this doesn't take page-level filters

  const { 
    data: topUsersChartData, 
    isLoading: isLoadingTopUsersChart, 
    isError: isErrorTopUsersChart, 
    error: errorTopUsersChart 
  } = useGetStructurizrTopUsersChartData(); // Assuming this doesn't take page-level filters

  // Example for raw data if needed:
  // const { data: rawWorkspaces, isLoading: isLoadingRaw, isError: isErrorRaw } = useGetRawStructurizrWorkspaces(filters);

  return (
    <div className="space-y-6">
      {/* Stats Card Section */}
      <section aria-labelledby="structurizr-stats-title">
        <h2 id="structurizr-stats-title" className="sr-only">Structurizr Statistics</h2>
        {isLoadingPageStats && <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">Loading statistics...</div>}
        {isErrorPageStats && <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">Error loading statistics: {errorPageStats?.message}</div>}
        {pageStats && pageStats.length > 0 && <StatsCard items={pageStats} />}
        {!isLoadingPageStats && !isErrorPageStats && (!pageStats || pageStats.length === 0) && (
            <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">No statistics data available for selected filters.</div>
        )}
      </section>

      {/* Workspaces Chart Section */}
      <section aria-labelledby="ws-creation-chart-title" className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6"> {/* Increased mb from 4 to 6 */}
          <h2 id="ws-creation-chart-title" className="text-xl font-medium text-gray-900">Structurizr Workspaces</h2>
          {/* Filter specific to this chart, if different from page filters, would be managed here */}
          {/* For now, assumes page filters apply or it uses its own default timeframe */}
          <div className="flex items-center">
            <button className="text-sm font-medium text-primary-500 bg-primary-50 px-3 py-1 rounded-md">
              This month {/* This button might become dynamic or reflect current filter */}
            </button>
          </div>
        </div>
        
        {isLoadingWsCreationChart && <div className="h-64 flex items-center justify-center text-gray-500">Loading workspace creation chart...</div>}
        {isErrorWsCreationChart && <div className="h-64 flex items-center justify-center text-red-500">Error: {errorWsCreationChart?.message}</div>}
        {workspaceCreationChartData && workspaceCreationChartData.length > 0 && (
          // Your WorkspaceChart component should be adapted to take StructurizrActivityChartDataPoint[]
          // And internally map 'active', 'created', 'deleted' to different lines
          <WorkspaceChart data={workspaceCreationChartData} />
        )}
        {!isLoadingWsCreationChart && !isErrorWsCreationChart && (!workspaceCreationChartData || workspaceCreationChartData.length === 0) && (
             <div className="h-64 flex items-center justify-center text-gray-500">No workspace creation data for selected filters.</div>
        )}
        
        {/* Legend (can be part of WorkspaceChart or dynamic based on its data keys) */}
        <div className="flex mt-4">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Created</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Deleted</span>
          </div>
        </div>
      </section>
      
      {/* Access methods and Top users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Access methods chart/table Section */}
        <section aria-labelledby="access-methods-title" className="bg-white rounded-lg shadow p-6">
          <h2 id="access-methods-title" className="text-xl font-medium text-gray-900 mb-6">How workspaces are being accessed</h2>
          
          {isLoadingAccessMethods && <div className="text-center py-4 text-gray-500">Loading access methods...</div>}
          {isErrorAccessMethods && <div className="text-center py-4 text-red-500">Error: {errorAccessMethods?.message}</div>}
          {accessMethodsData && accessMethodsData.tableData && (
            <>
              {/* <AccessMethodsChartPlaceholder data={accessMethodsData.chartData} /> */} {/* If you have chart data */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAGE NAME</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL USERS</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RATE</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accessMethodsData.tableData.map((item: StructurizrAccessMethod, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 flex items-center">
                        {/* Dynamic dot color could be added here based on item.pageName */}
                        <div className={`w-3 h-3 ${
                            item.pageName === 'API' ? 'bg-blue-500' : 
                            item.pageName === 'CLI' ? 'bg-orange-500' : 'bg-red-500'
                          } rounded-full mr-2`}></div>
                        {item.pageName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.totalUsers}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-green-500">{item.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {!isLoadingAccessMethods && !isErrorAccessMethods && !accessMethodsData?.tableData && (
            <div className="text-center py-4 text-gray-500">No access methods data available.</div>
          )}
        </section>
        
        {/* Top users chart Section */}
        <section aria-labelledby="structurizr-top-users-title" className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 id="structurizr-top-users-title" className="text-xl font-medium text-gray-900">TOP USERS</h2>
            <span className="text-green-500 flex items-center text-sm"> {/* This trend could also come from data */}
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              3.5% Increase
            </span>
          </div>
          
          {isLoadingTopUsersChart && <div className="h-64 flex items-center justify-center text-gray-500">Loading top users chart...</div>}
          {isErrorTopUsersChart && <div className="h-64 flex items-center justify-center text-red-500">Error: {errorTopUsersChart?.message}</div>}
          {topUsersChartData && topUsersChartData.length > 0 && (
            <TopUsersBarChartPlaceholder data={topUsersChartData} />
            // Replace with your actual bar chart component for top users
            // e.g., <UserBarChart data={topUsersChartData} dataKey="workspaces" />
          )}
           {!isLoadingTopUsersChart && !isErrorTopUsersChart && (!topUsersChartData || topUsersChartData.length === 0) && (
             <div className="h-64 flex items-center justify-center text-gray-500">No top users data available.</div>
           )}
        </section>
      </div>
    </div>
  );
};

export default StructurizrAnalytics;