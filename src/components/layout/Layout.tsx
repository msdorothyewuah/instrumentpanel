// src/components/layout/Layout.tsx
import React, { ReactNode, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom'; // Using Outlet for nested routes
import Sidebar from './Sidebar';
import Header from './Header'; // Your main app header (with Download button)
import PageHeader from './PageHeader'; // The header with title and filters
import Footer from './Footer';
import { ActiveFilters, TimeframeId, DepartmentId, RegionId } from '../../types/common';
import {
  DEFAULT_TIMEFRAME_ID,
  DEFAULT_DEPARTMENT_ID,
  DEFAULT_REGION_ID
} from '../../constants/Filters';

interface LayoutProps {
  // children prop is implicitly handled by <Outlet /> if App.tsx uses Layout as a wrapper for routes
}

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    timeframe: DEFAULT_TIMEFRAME_ID,
    department: DEFAULT_DEPARTMENT_ID,
    region: DEFAULT_REGION_ID,
  });

  const handleTimeframeChange = (timeframeId: TimeframeId) => {
    setActiveFilters(prev => ({ ...prev, timeframe: timeframeId }));
  };
  const handleDepartmentChange = (departmentId: DepartmentId) => {
    setActiveFilters(prev => ({ ...prev, department: departmentId }));
  };
  const handleRegionChange = (regionId: RegionId) => {
    setActiveFilters(prev => ({ ...prev, region: regionId }));
  };

  const getPageTitle = (): string => {
    switch (location.pathname) {
      case '/':
        return 'Analytics Overview';
      case '/c4ts':
        return 'C4TS Analytics';
      case '/structurizr':
        return 'Structurizr Analytics';
      default:
        return 'EA Analytics'; // Fallback title
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header /> {/* This is the top-most header, e.g., with Download button */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <PageHeader
            title={getPageTitle()}
            activeFilters={activeFilters}
            onTimeframeChange={handleTimeframeChange}
            onDepartmentChange={handleDepartmentChange}
            onRegionChange={handleRegionChange}
          />
          <div className="mt-6">
            {/* Pass activeFilters to the child route's component */}
            {/* This requires child components to accept an activeFilters prop */}
            <Outlet context={{ activeFilters }} />
          </div>
        </main>
        <Footer lastUpdated="Today, at 10:00 AM" refreshInterval={4} />
      </div>
    </div>
  );
};

export default Layout;