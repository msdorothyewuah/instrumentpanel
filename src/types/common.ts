export type TimeframeOption = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all-time';
export type DepartmentOption = string | 'All';
export type RegionOption = string | 'All';

export interface FilterOptions {
  timeframe: TimeframeOption;
  department: DepartmentOption;
  region: RegionOption;
}

export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
}

export interface Trend {
  value: number;
  direction: 'up' | 'down' | 'neutral';
}

export interface StatsCardData {
  title: string;
  value: number | string;
  trend?: Trend;
  formattedValue?: string;
}

export interface UserData {
  id: string;
  name: string;
  department: string;
  c4tsApiHits?: number;
  structurizrWorkspaces?: number;
}

export interface ApiEndpointData {
  url: string;
  hits: number;
}