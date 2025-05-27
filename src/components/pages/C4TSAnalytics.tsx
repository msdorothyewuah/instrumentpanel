// src/pages/C4TSAnalytics.tsx
import React, { useEffect } from 'react';
import {
  useGetC4TSPageStats,
  useGetC4TSApiHitsChartData,
  useGetC4TSTopUsersChartData,
  useGetC4TSApiHitsUrlTable,
} from '../hooks/c4tsQueries'; // Adjust path
import { FilterParams, C4TSApiHitURLRow } from '../services/apiService'; // Adjust path
import StatsCard from '../components/dashboard/StatsCard'; // Assuming you might want a stats card here too

// Placeholder components
const ApiHitsLineChartPlaceholder: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 relative">
    <p className="text-gray-500">API Hits Line Chart (Data points: {data?.length || 0})</p>
    {/* Example peak indicator from your design, could be made dynamic */}
    {data && data.length > 0 && (
        <div className="absolute top-1/4 right-1/3 bg-blue-800 text-white text-xs font-medium px-2 py-1 rounded shadow-sm">
            {/* This would need logic to find the actual peak from data */}
            Peak Hit<br/>Example Date
        </div>
    )}
  </div>
);

const C4TSTopUsersBarChartPlaceholder: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
    <p className="text-gray-500">C4TS Top Users Bar Chart (Data points: {data?.length || 0})</p>
  </div>
);

interface C4TSAnalyticsPageProps {
  filters: FilterParams; // Received from Layout.tsx
}

const C4TSAnalytics: React.FC<C4TSAnalyticsPageProps> = ({ filters }) => {
  useEffect(() => {
    console.log("C4TSAnalytics page received filters:", filters);
  }, [filters]);

  const { 
    data: pageStats, 
    isLoading: isLoadingPageStats, 
    isError: isErrorPageStats, 
    error: errorPageStats 
  } = useGetC4TSPageStats(filters);

  const { 
    data: apiHitsChartData, 
    isLoading: isLoadingApiHitsChart, 
    isError: isErrorApiHitsChart, 
    error: errorApiHitsChart 
  } = useGetC4TSApiHitsChartData(filters);

  const { 
    data: topUsersChartData, 
    isLoading: isLoadingTopUsersChart, 
    isError: isErrorTopUsersChart, 
    error: errorTopUsersChart 
  } = useGetC4TSTopUsersChartData(); // Assuming this doesn't take page-level filters

  const { 
    data: apiHitsUrlTableData, 
    isLoading: isLoadingApiHitsUrlTable, 
    isError: isErrorApiHitsUrlTable, 
    error: errorApiHitsUrlTable 
  } = useGetC4TSApiHitsUrlTable(); // Assuming this doesn't take page-level filters


  return (
    <div className="space-y-6">
      {/* Optional Stats Card for C4TS Page if needed */}
      {isLoadingPageStats && <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">Loading statistics...</div>}
      {isErrorPageStats && <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">Error loading statistics: {errorPageStats?.message}</div>}
      {pageStats && pageStats.length > 0 && <StatsCard items={pageStats} />}
      {!isLoadingPageStats && !isErrorPageStats && (!pageStats || pageStats.length === 0) && (
            <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">No statistics data available for selected filters.</div>
      )}

      {/* API Hits chart Section */}
      <section aria-labelledby="c4ts-api-hits-title" className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 id="c4ts-api-hits-title" className="text-xl font-medium text-gray-900">API Hits</h2>
          <div className="flex items-center">
            <button className="text-sm font-medium text-primary-500 bg-primary-50 px-3 py-1 rounded-md">
              This month {/* Dynamic or reflects filter */}
            </button>
          </div>
        </div>
        
        {isLoadingApiHitsChart && <div className="h-64 flex items-center justify-center text-gray-500">Loading API hits chart...</div>}
        {isErrorApiHitsChart && <div className="h-64 flex items-center justify-center text-red-500">Error: {errorApiHitsChart?.message}</div>}
        {apiHitsChartData && apiHitsChartData.length > 0 && (
          <ApiHitsLineChartPlaceholder data={apiHitsChartData} />
          // Replace with your actual line chart component for API hits
          // e.g., <LineChartComponent data={apiHitsChartData} dataKey="count" />
        )}
        {!isLoadingApiHitsChart && !isErrorApiHitsChart && (!apiHitsChartData || apiHitsChartData.length === 0) && (
           <div className="h-64 flex items-center justify-center text-gray-500">No API hits data for selected filters.</div>
        )}
      </section>
      
      {/* Top Users chart and API Hits URL table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users chart Section */}
        <section aria-labelledby="c4ts-top-users-title" className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 id="c4ts-top-users-title" className="text-lg font-medium text-gray-900">TOP USERS</h2>
            <span className="text-green-500 flex items-center text-sm"> {/* Dynamic trend */}
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              3.5% Increase
            </span>
          </div>
          
          {isLoadingTopUsersChart && <div className="h-64 flex items-center justify-center text-gray-500">Loading top users chart...</div>}
          {isErrorTopUsersChart && <div className="h-64 flex items-center justify-center text-red-500">Error: {errorTopUsersChart?.message}</div>}
          {topUsersChartData && topUsersChartData.length > 0 && (
            <C4TSTopUsersBarChartPlaceholder data={topUsersChartData} />
            // Replace with your actual bar chart component
            // e.g., <UserBarChart data={topUsersChartData} dataKey="hits" />
          )}
          {!isLoadingTopUsersChart && !isErrorTopUsersChart && (!topUsersChartData || topUsersChartData.length === 0) && (
            <div className="h-64 flex items-center justify-center text-gray-500">No top users data available.</div>
          )}
        </section>
        
        {/* API Hits URL table Section */}
        <section aria-labelledby="api-hits-url-title" className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 id="api-hits-url-title" className="text-lg font-medium text-gray-900">API Hits (URL)</h2>
            <button className="text-primary-500 text-sm font-medium hover:text-primary-600">
              See All
            </button>
          </div>
          
          {isLoadingApiHitsUrlTable && <div className="p-4 text-center text-gray-500">Loading API hits by URL...</div>}
          {isErrorApiHitsUrlTable && <div className="p-4 text-center text-red-500">Error: {errorApiHitsUrlTable?.message}</div>}
          {apiHitsUrlTableData && apiHitsUrlTableData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL (USER in your previous code)</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">NUMBER OF HITS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiHitsUrlTableData.map((item: C4TSApiHitURLRow, index: number) => (
                    <tr key={index}> {/* Use item.url if unique, or another stable ID */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.url}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.hits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoadingApiHitsUrlTable && !isErrorApiHitsUrlTable && (!apiHitsUrlTableData || apiHitsUrlTableData.length === 0) && (
             <div className="p-4 text-center text-gray-500">No API hits by URL data available.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default C4TSAnalytics;