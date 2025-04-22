const StructurizrAnalytics = () => {
    return (
      <div className="space-y-6">
        {/* Workspaces chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">Structurizr Workspaces</h2>
            <div className="flex items-center">
              <button className="text-sm font-medium text-primary-500 bg-primary-50 px-3 py-1 rounded-md">
                This month
              </button>
            </div>
          </div>
          
          {/* Chart placeholder */}
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-500">Chart: Workspaces over time</p>
          </div>
          
          {/* Legend */}
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
        </div>
        
        {/* Access methods and Top users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Access methods chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-6">How workspaces are being accessed</h2>
            
            {/* Chart placeholder */}
            <div className="h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 mb-4">
              <p className="text-gray-500">Chart: Access methods distribution</p>
            </div>
            
            {/* Access methods table */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PAGE NAME
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TOTAL USERS
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RATE
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    API
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">350</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-green-500">1.94%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    CLI
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">100</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-green-500">0.94%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Mix of both
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">500</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-green-500">8.94%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Top users chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900">TOP USERS</h2>
              <span className="text-green-500 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                3.5% Increase
              </span>
            </div>
            
            {/* Chart placeholder */}
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
              <p className="text-gray-500">Chart: Top users bar chart</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default StructurizrAnalytics;