import { useState, useEffect } from 'react';
import { TIMEFRAME_OPTIONS, DEPARTMENT_OPTIONS, REGION_OPTIONS } from '../../constants/filters';

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  const [timeframe, setTimeframe] = useState('all-time');
  const [department, setDepartment] = useState('All');
  const [region, setRegion] = useState('All');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString(undefined, options));
  }, []);

  const StyledSelect = ({ 
    label, 
    options, 
    value, 
    onChange 
  }: { 
    label: string; 
    options: { value: string; label: string }[]; 
    value: string; 
    onChange: (value: string) => void; 
  }) => (
    <div className="relative">
      <label htmlFor={`select-${label.toLowerCase()}`} className="block text-sm font-medium text-gray-700 mb-1">
        {label}:
      </label>
      <div className="relative">
        <select
          id={`select-${label.toLowerCase()}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-6">
      {/* Title and Date row */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-6">
        <StyledSelect 
          label="Timeframe"
          options={TIMEFRAME_OPTIONS}
          value={timeframe}
          onChange={setTimeframe}
        />

        <StyledSelect 
          label="Department"
          options={DEPARTMENT_OPTIONS}
          value={department}
          onChange={setDepartment}
        />

        <StyledSelect 
          label="Region"
          options={REGION_OPTIONS}
          value={region}
          onChange={setRegion}
        />
      </div>
    </div>
  );
};

export default PageHeader;