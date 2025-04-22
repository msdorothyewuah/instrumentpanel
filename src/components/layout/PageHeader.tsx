import { useState, useEffect } from 'react';

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  const [timeframe, setTimeframe] = useState('all-time');
  const [department, setDepartment] = useState('All');
  const [region, setRegion] = useState('All');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Format current date based on user's locale
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString(undefined, options));
  }, []);

  return (
    <div className="pb-6">
      {/* Title and Date row */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Timeframe filter */}
        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
            Timeframe:
          </label>
          <select 
            id="timeframe"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="all-time">All time</option>
            <option value="year">Last 12 months</option>
            <option value="quarter">Last 90 days</option>
            <option value="month">Last 30 days</option>
            <option value="week">Last 7 days</option>
            <option value="day">Last 24 hours</option>
          </select>
        </div>

        {/* Department filter */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department:
          </label>
          <select 
            id="department"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="All">All</option>
            <option value="ETS">ETS</option>
            <option value="TOR">TOR</option>
            <option value="FIN">FIN</option>
          </select>
        </div>

        {/* Region filter */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            Region:
          </label>
          <select 
            id="region"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="All">All</option>
            <option value="NA">North America</option>
            <option value="EU">Europe</option>
            <option value="APAC">Asia Pacific</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;