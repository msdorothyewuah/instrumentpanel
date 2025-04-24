import React from 'react';

interface StatsCardProps {
  items: {
    title: string;
    value: string | number;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }[];
}

const StatsCard: React.FC<StatsCardProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`flex-1 p-6 ${
              index < items.length - 1 ? 'relative' : ''
            }`}
          >
            {/* Add vertical divider only between items, not on the last item */}
            {index < items.length - 1 && (
              <div className="absolute right-0 inset-y-0 flex items-center">
                <div className="h-1/2 w-px bg-gray-200"></div>
              </div>
            )}
            
            <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
            <div className="mt-2 flex justify-between items-end">
              <span className="text-3xl font-semibold text-gray-900">{item.value}</span>
              {item.trend && (
                <span className={`flex items-center text-sm ${item.trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  <svg 
                    className="w-4 h-4 mr-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    {item.trend.isPositive ? (
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                    )}
                  </svg>
                  {item.trend.value.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;