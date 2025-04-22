const Overview = () => {
    return (
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* API Hits Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total API Hits (C4TS)</h3>
            <div className="mt-2 flex justify-between items-end">
              <p className="text-3xl font-semibold">1,567</p>
              <span className="text-green-500 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                10.0%
              </span>
            </div>
          </div>
          
          {/* Active Workspaces Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Workspace (Structurizr)</h3>
            <div className="mt-2 flex justify-between items-end">
              <p className="text-3xl font-semibold">36</p>
              <span className="text-red-500 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                3.0%
              </span>
            </div>
          </div>
          
          {/* Total Users Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <div className="mt-2 flex justify-between items-end">
              <p className="text-3xl font-semibold">156</p>
              <span className="text-green-500 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                3.2%
              </span>
            </div>
          </div>
          
          {/* Total Departments Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Departments</h3>
            <div className="mt-2 flex justify-between items-end">
              <p className="text-3xl font-semibold">23</p>
              <span className="text-green-500 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                8.3%
              </span>
            </div>
          </div>
        </div>
        
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USER
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DEPARTMENT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    C4TS API HITS
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Structurizr Workspaces
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