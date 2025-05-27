// src/components/layout/PageHeader.tsx
import React, { useEffect, useState } from 'react';

// Mock options - replace with your actual constants if they exist elsewhere
const TIMEFRAME_OPTIONS = [
  { value: 'all-time', label: 'All time' }, { value: 'year', label: 'Last 12 months' },
  { value: 'quarter', label: 'Last 90 days' }, { value: 'month', label: 'Last 30 days' },
  { value: 'week', label: 'Last 7 days' }, { value: 'day', label: 'Last 24 hours' },
];
const DEPARTMENT_OPTIONS = [
  { value: 'All', label: 'All' }, { value: 'ETS', label: 'ETS' },
  { value: 'TOR', label: 'TOR' }, { value: 'FIN', label: 'FIN' },
];
const REGION_OPTIONS = [
  { value: 'All', label: 'All' }, { value: 'NA', label: 'North America' },
  { value: 'EU', label: 'Europe' }, { value: 'APAC', label: 'Asia Pacific' },
];

interface PageHeaderProps {
  title: string;
  currentTimeframe: string;
  setCurrentTimeframe: (value: string) => void;
  currentDepartment: string;
  setCurrentDepartment: (value: string) => void;
  currentRegion: string;
  setCurrentRegion: (value: string) => void;
}

const PageHeader = ({ 
  title,
  currentTimeframe,
  setCurrentTimeframe,
  currentDepartment,
  setCurrentDepartment,
  currentRegion,
  setCurrentRegion
}: PageHeaderProps) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString(undefined, options));
  }, []);

  return (
    <div className="pb-6">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>
      
      <div className="flex flex-wrap items-end gap-4"> {/* Ensure gap for spacing */}
        {/* Timeframe filter */}
        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
            Timeframe:
          </label>
          <select 
            id="timeframe"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={currentTimeframe}
            onChange={(e) => setCurrentTimeframe(e.target.value)}
          >
            {TIMEFRAME_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
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
            value={currentDepartment}
            onChange={(e) => setCurrentDepartment(e.target.value)}
          >
            {DEPARTMENT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
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
            value={currentRegion}
            onChange={(e) => setCurrentRegion(e.target.value)}
          >
            {REGION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;