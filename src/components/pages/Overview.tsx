// src/pages/Overview.tsx

import React from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import { api } from '../utils/api';

const Overview: React.FC = () => {
  // Fetch Structurizr workspace total count
  const { data: structurizrCount, isLoading: isLoadingStructurizrCount } = 
    api.workspace.getTotalCount.useQuery();
  
  // Fetch C4TS data (assuming you have similar endpoints for C4TS)
  // For this example, I'm using placeholder data
  const c4tsApiHits = 1567;
  
  // Stats data for the overview page
  const statsItems = [
    {
      title: "Total API Hits (C4TS)",
      value: c4tsApiHits,
      trend: { value: 10.0, isPositive: true }
    },
    {
      title: "Active Workspace (Structurizr)",
      value: isLoadingStructurizrCount ? "Loading..." : structurizrCount || 0,
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
      {/* Stats card */}
      <StatsCard items={statsItems} />
      
      {/* Rest of the Overview page content */}
      {/* ... */}
    </div>
  );
};

export default Overview;