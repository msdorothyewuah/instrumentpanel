const C4TSAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* API Hits chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-900">API Hits</h2>
          <div className="flex items-center">
            <button className="text-sm font-medium text-primary-500 bg-primary-50 px-3 py-1 rounded-md">
              This month
            </button>
          </div>
        </div>
        
        {/* Chart placeholder */}
        <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50 relative">
          <p className="text-gray-500">Chart: API hits over time</p>
          
          {/* Peak indicator */}
          <div className="absolute top-1/4 right-1/3 bg-blue-800 text-white text-xs font-medium px-2 py-1 rounded shadow-sm">
            289 Hits<br/>March, 2025
          </div>
        </div>
      </div>
      
      {/* Top Users chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">TOP USERS</h2>
            <span className="text-green-500 flex items-center text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              3.5% Increase
            </span>
          </div>
          
          {/* Users chart placeholder */}
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-500">Chart: Top users by API usage</p>
          </div>
        </div>
        
        {/* API Hits URL table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">API Hits (URL)</h2>
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
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NUMBER OF HITS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">api/v2/translation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">89</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">api/v1/export</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">87</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">api/v1/translation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">56</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C4TSAnalytics;