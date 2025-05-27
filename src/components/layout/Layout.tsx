// src/components/layout/Layout.tsx
import React, { ReactNode, useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import PageHeader from './PageHeader';
import Footer from './Footer';
import { FilterParams } from '../../services/apiService'; // Ensure this path is correct

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const [timeframe, setTimeframe] = useState<string>('all-time');
  const [department, setDepartment] = useState<string>('All');
  const [region, setRegion] = useState<string>('All');

  // Create a stable filters object only when filter values change
  const currentFilters: FilterParams = useMemo(() => ({
    timeframe,
    department,
    region,
  }), [timeframe, department, region]);

  const getTitle = (): string => {
    switch(location.pathname) {
      case '/':
        return 'Analytics Overview';
      case '/c4ts':
        return 'C4TS Analytics';
      case '/structurizr':
        return 'Structurizr Analytics';
      default:
        return 'EA Analytics';
    }
  };

  // Log when filters change for debugging
  useEffect(() => {
    console.log("Filters updated in Layout:", currentFilters);
  }, [currentFilters]);

  return (
    <div className="app-container flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="main-content flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <PageHeader 
              title={getTitle()}
              currentTimeframe={timeframe}
              setCurrentTimeframe={setTimeframe}
              currentDepartment={department}
              setCurrentDepartment={setDepartment}
              currentRegion={region}
              setCurrentRegion={setRegion}
            />
            {/* Pass current filters to children (page components) */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                // TypeScript needs a bit of help here to know children can accept 'filters'
                // This assumes child components are designed to accept 'filters' or will ignore it.
                return React.cloneElement(child, { filters: currentFilters } as { filters: FilterParams }); 
              }
              return child;
            })}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;