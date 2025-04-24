import React from 'react';
import StatsCard from '../dashboard/StatsCard';

const Overview: React.FC = () => {
  // Define stats data
  const statsItems = [
    {
      title: "Total API Hits (C4TS)",
      value: "1,567",
      trend: { value: 10.0, isPositive: true }
    },
    {
      title: "Active Workspace (Structurizr)",
      value: "36",
      trend: { value: 3.0, isPositive: false }
    },
    {
      title: "Total Users",
      value: "156",
      trend: { value: 3.2, isPositive: true }
    },
    {
      title: "Total Departments",
      value: "23",
      trend: { value: 8.3, isPositive: true }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats card (unified with suspended dividers) */}
      <StatsCard items={statsItems} />
      
      {/* Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C4TS Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">C4TS Analytics</h2>
            <a href="/c4ts" className="text-primary-500 text-sm font-medium hover:text-primary-600">
              View Details →
            </a>
          </div>
          
          {/* Chart placeholder */}
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-500">Chart: API hits over time</p>
          </div>
          
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Most Used Endpoint</p>
              <p className="font-medium">/translate</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Top User</p>
              <p className="font-medium">saakaray</p>
            </div>
          </div>
        </div>
        
        {/* Structurizr Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Structurizr Analytics</h2>
            <a href="/structurizr" className="text-primary-500 text-sm font-medium hover:text-primary-600">
              View Details →
            </a>
          </div>
          
          {/* Chart placeholder */}
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-500">Chart: Workspaces over time</p>
          </div>
          
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Workspaces</p>
              <p className="font-medium">36</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Top User</p>
              <p className="font-medium">browjose</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Users table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Top Users Across All Systems</h2>
          <button className="text-primary-500 text-sm font-medium hover:text-primary-600">
            See All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  USER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DEPARTMENT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  C4TS API HITS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STRUCTURIZR WORKSPACES
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User A</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ETS</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">89</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User B</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TOR</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">87</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">9</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User C</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ETS</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">56</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;