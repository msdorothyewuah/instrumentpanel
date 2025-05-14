// src/pages/StructurizrAnalytics.tsx

import React, { useState } from 'react';
import { api } from '../utils/api';
import StatsCard from '../components/dashboard/StatsCard';
import WorkspaceChart from '../components/dashboard/WorkspaceChart';

const StructurizrAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('month');
  
  // Fetch stats data
  const { data: statsData, isLoading: isLoadingStats } = api.workspace.getStats.useQuery({
    timeRange: timeframe
  });
  
  // Fetch total count
  const { data: totalCount, isLoading: isLoadingTotal } = api.workspace.getTotalCount.useQuery();
  
  // Fetch recent workspaces
  const { data: recentWorkspaces, isLoading: isLoadingRecent } = api.workspace.getRecentWorkspaces.useQuery({
    limit: 5
  });
  
  // Stats items for StatsCard component
  const statsItems = [
    {
      title: "Active Workspaces",
      value: isLoadingTotal ? "Loading..." : totalCount || 0,
      trend: { value: 8.3, isPositive: true }
    },
    {
      title: "Created This Month",
      value: isLoadingStats ? "Loading..." : statsData?.reduce((sum, item) => sum + item.count, 0) || 0,
      trend: { value: 10.0, isPositive: true }
    },
    {
      title: "Average Daily Creation",
      value: isLoadingStats ? "Loading..." : Math.round(
        (statsData?.reduce((sum, item) => sum + item.count, 0) || 0) / 
        (statsData?.length || 1)
      ),
      trend: { value: 3.2, isPositive: true }
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Page Header with filters will be added by the Layout component */}
      
      {/* Stats card */}
      <StatsCard items={statsItems} />
      
      {/* Workspaces Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Workspace Creation Over Time</h2>
          <div className="flex items-center">
            <select
              className="ml-2 block border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 12 Months</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
        </div>
        
        {isLoadingStats ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Loading chart data...</p>
          </div>
        ) : !statsData || statsData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">No data available for the selected time period</p>
          </div>
        ) : (
          <WorkspaceChart data={statsData} />
        )}
      </div>
      
      {/* Recent Workspaces Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recently Created Workspaces</h2>
        </div>
        
        {isLoadingRecent ? (
          <div className="py-4 text-center">
            <p className="text-gray-500">Loading recent workspaces...</p>
          </div>
        ) : !recentWorkspaces || recentWorkspaces.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-gray-500">No recent workspaces</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workspace ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentWorkspaces.map(workspace => (
                  <tr key={workspace._id?.toString()}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {workspace.workspaceId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workspace.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workspace.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(workspace.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};



export default StructurizrAnalytics;

