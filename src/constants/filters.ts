// src/constants/Filters.tsx

import { FilterOption, TimeframeId, DepartmentId, RegionId } from '../types/common'; // Adjust path

// --- Dropdown Options ---
export const TIMEFRAME_OPTIONS: FilterOption[] = [
  { id: 'all-time', label: 'All time' },
  { id: 'year', label: 'Last 12 months' },
  { id: 'quarter', label: 'Last 90 days' },
  { id: 'month', label: 'Last 30 days' },
  { id: 'week', label: 'Last 7 days' },
  { id: 'day', label: 'Last 24 hours' },
];

export const DEPARTMENT_OPTIONS: FilterOption[] = [
  { id: 'ALL_DEPARTMENTS', label: 'All Departments' }, // Using a specific ID for "All"
  { id: 'ETS', label: 'ETS' },
  { id: 'TOR', label: 'TOR' },
  { id: 'FIN', label: 'FIN' },
  // Add other departments
];

export const REGION_OPTIONS: FilterOption[] = [
  { id: 'ALL_REGIONS', label: 'All Regions' }, // Using a specific ID for "All"
  { id: 'NA', label: 'North America' },
  { id: 'EU', label: 'Europe' },
  { id: 'APAC', label: 'Asia Pacific' },
  // Add other regions
];

// --- Default Selected Filter Values ---
export const DEFAULT_TIMEFRAME_ID: TimeframeId = 'all-time';
export const DEFAULT_DEPARTMENT_ID: DepartmentId = 'ALL_DEPARTMENTS'; // Match ID from options
export const DEFAULT_REGION_ID: RegionId = 'ALL_REGIONS';         // Match ID from options