// src/services/apiService.ts
import {
  DataPoint,
  CategoricalChartData,
  OverviewSummaryStats,
  // C4TSPageData and StructurizrPageData are not used if we go fully granular for those pages
} from '../types/analytics';
import { Trend, UserData, ApiEndpointData, FilterOptions } from '../types/common';

const MOCK_DELAY_MS = 600; // Simulate network latency

const simulateDelay = <T>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY_MS));
};

// --- Overview Page API Calls ---

export const fetchOverviewSummaryStats = async (): Promise<OverviewSummaryStats> => {
  console.log('Mock API: fetchOverviewSummaryStats called');
  const data: OverviewSummaryStats = {
    totalApiHits: { value: 1567, trend: { value: 10.0, direction: 'up' } },
    activeWorkspaces: { value: 36, trend: { value: 3.0, direction: 'down' } },
    totalUsers: { value: 156, trend: { value: 3.2, direction: 'up' } },
    totalDepartments: { value: 23, trend: { value: 8.3, direction: 'up' } },
  };
  return simulateDelay(data);
};

// This is for the C4TS chart on the Overview page
export const fetchC4TSOverviewChartData = async (): Promise<{
  seriesData: DataPoint[];
  mostUsedEndpoint?: string;
  topUser?: string;
}> => {
  console.log('Mock API: fetchC4TSOverviewChartData called');
  const data = {
    seriesData: [
      { date: 'Mar 18', value: 42 }, { date: 'Mar 19', value: 44 }, { date: 'Mar 20', value: 61 },
      { date: 'Mar 21', value: 52 }, { date: 'Mar 22', value: 68 }, { date: 'Mar 23', value: 90 },
      { date: 'Mar 24', value: 53 }, { date: 'Mar 25', value: 68 }, { date: 'Mar 26', value: 61 },
    ],
    mostUsedEndpoint: '/translate',
    topUser: 'saikaray',
  };
  return simulateDelay(data);
};

// This is for the Structurizr chart on the Overview page
export const fetchStructurizrOverviewChartData = async (): Promise<{
  seriesData: DataPoint[];
  topUser?: string;
}> => {
  console.log('Mock API: fetchStructurizrOverviewChartData called');
  const data = {
    seriesData: [
      { date: 'Mar 18', value: 60 }, { date: 'Mar 19', value: 55 }, { date: 'Mar 20', value: 40 },
      { date: 'Mar 21', value: 60 }, { date: 'Mar 22', value: 50 }, { date: 'Mar 23', value: 85 },
      { date: 'Mar 24', value: 70 }, { date: 'Mar 25', value: 60 }, { date: 'Mar 26', value: 55 },
    ],
    topUser: 'browjose',
  };
  return simulateDelay(data);
};

export const fetchTopUsersAcrossSystems = async (): Promise<UserData[]> => {
  console.log('Mock API: fetchTopUsersAcrossSystems called');
  const data: UserData[] = [
    { id: 'userA', name: 'User A', department: 'ETS', c4tsApiHits: 89, structurizrWorkspaces: 8 },
    { id: 'userB', name: 'User B', department: 'TOR', c4tsApiHits: 87, structurizrWorkspaces: 9 },
    { id: 'userC', name: 'User C', department: 'ETS', c4tsApiHits: 56, structurizrWorkspaces: 5 },
    { id: 'userD', name: 'User D', department: 'FIN', c4tsApiHits: 45, structurizrWorkspaces: 12 },
    { id: 'userE', name: 'User E', department: 'TOR', c4tsApiHits: 30, structurizrWorkspaces: 3 },
  ];
  return simulateDelay(data);
};


// --- C4TS Analytics Page API Calls (Granular) ---

export const fetchC4TSApiHitsOverTime = async (
  filters?: Partial<FilterOptions> // Optional filters
): Promise<DataPoint[]> => {
  console.log('Mock API: fetchC4TSApiHitsOverTime called with filters:', filters);
  // In a real API, you'd use filters to query data. Here we just return static data.
  // For demonstration, we can slightly alter data if a filter is present, but a real API would do more.
  let baseData: DataPoint[] = [
    { date: 'Mar 1', value: 30 }, { date: 'Mar 2', value: 35 }, { date: 'Mar 3', value: 40 },
    { date: 'Mar 4', value: 32 }, { date: 'Mar 5', value: 45 }, { date: 'Mar 6', value: 50 },
    { date: 'Mar 7', value: 58 }, { date: 'Mar 8', value: 60 }, { date: 'Mar 9', value: 55 },
    { date: 'Mar 10', value: 62 }, { date: 'Mar 11', value: 68 }, { date: 'Mar 12', value: 70 },
    { date: 'Mar 13', value: 65 }, { date: 'Mar 14', value: 72 }, { date: 'Mar 15', value: 78 },
    { date: 'Mar 16', value: 80 }, { date: 'Mar 17', value: 75 }, { date: 'Mar 18', value: 82 },
    { date: 'Mar 19', value: 88 }, { date: 'Mar 20', value: 90 }, { date: 'Mar 21', value: 85 },
    { date: 'Mar 22', value: 92 }, { date: 'Mar 23', value: 95 }, // Peak in UI
    { date: 'Mar 24', value: 80 }, { date: 'Mar 25', value: 75 }, { date: 'Mar 26', value: 70 },
  ];
  if (filters?.timeframe === 'week') { // Example: simulate different data for 'week'
      baseData = baseData.slice(-7).map(d => ({...d, value: d.value - 10 }));
  }
  return simulateDelay(baseData);
};

export const fetchC4TSTopEndpoints = async (
  filters?: Partial<FilterOptions>
): Promise<ApiEndpointData[]> => {
  console.log('Mock API: fetchC4TSTopEndpoints called with filters:', filters);
  const data: ApiEndpointData[] = [
    { id: 'translate_v2', url: 'api/v2/translation', hits: 89 },
    { id: 'export_v1', url: 'api/v1/export', hits: 87 },
    { id: 'translate_v1', url: 'api/v1/translation', hits: 56 },
    { id: 'status_v1', url: 'api/v1/status', hits: 45 },
    { id: 'users_v2', url: 'api/v2/users', hits: 30 },
    { id: 'search_v1', url: 'api/v1/search', hits: 25 },
  ];
  return simulateDelay(data);
};

export const fetchC4TSTopUsersChartData = async (
  filters?: Partial<FilterOptions>
): Promise<CategoricalChartData[]> => {
  console.log('Mock API: fetchC4TSTopUsersChartData called with filters:', filters);
  const data: CategoricalChartData[] = [
    { name: 'browjose', value: 120 }, { name: 'saikaray', value: 110 },
    { name: 'konadua', value: 95 }, { name: 'elisha', value: 80 },
    { name: 'kassim', value: 75 }, { name: 'dorothye', value: 60 },
  ];
  return simulateDelay(data);
};


// --- Structurizr Analytics Page API Calls (Granular) ---

// Type for the return data of workspace trends
export type WorkspaceTrendDataPoint = { date: string; active: number; created: number; deleted: number; };

export const fetchStructurizrWorkspacesTrend = async (
  filters?: Partial<FilterOptions>
): Promise<WorkspaceTrendDataPoint[]> => {
  console.log('Mock API: fetchStructurizrWorkspacesTrend called with filters:', filters);
  const data: WorkspaceTrendDataPoint[] = [
    { date: 'Mar 18', active: 80, created: 45, deleted: 40 },
    { date: 'Mar 19', active: 82, created: 50, deleted: 42 },
    { date: 'Mar 20', active: 75, created: 40, deleted: 50 },
    { date: 'Mar 21', active: 85, created: 55, deleted: 45 },
    { date: 'Mar 22', active: 90, created: 60, deleted: 48 },
    { date: 'Mar 23', active: 95, created: 65, deleted: 52 }, // Peak from UI (Active: 95, Created: 5, Deleted: 2 -- adjusted mock to reflect this roughly)
    { date: 'Mar 24', active: 88, created: 58, deleted: 55 },
    { date: 'Mar 25', active: 82, created: 52, deleted: 60 },
    { date: 'Mar 26', active: 80, created: 50, deleted: 58 },
  ];
   // Example adjustment for the UI peak (March, 2025, Active:30, Created:5, Deleted:2 - this seems specific to the tooltip on Mar 23)
   // The actual data point for Mar 23 should probably reflect the lines' values.
   // The tooltip in your UI seems to be summarizing changes ON that day, or totals for that day.
   // Let's assume the chart lines reflect 'active' workspaces primarily and the tooltip shows daily delta.
   // For the line chart data, we provide the cumulative/current values for 'active', 'created', 'deleted' as of that date if it's a trend.
   // If 'created' and 'deleted' are daily counts, then the mock data is fine.
   // The tooltip data in the screenshot "March, 2025, Active: 30, Created: 5, Deleted: 2" for Mar 23 looks like it might be *daily changes* or *current state* for that day.
   // For our mock data, `active` is the current number of active workspaces, `created` is the number created on that day, `deleted` is number deleted on that day.
   // The point (Mar 23) which has `Active: 30` in the screenshot's tooltip is confusing if the line itself is near 90.
   // I will mock the line data to reflect the visual lines, and the tooltip data needs to be derived or passed separately if it's different.
   // For now, the mock `active` value for Mar 23 is 95 to match the line.
  return simulateDelay(data);
};

// Type for the return data of access methods
export type AccessMethodData = { id: string; name: string; users: number; rate: number; color?: string; };

export const fetchStructurizrAccessMethods = async (): Promise<AccessMethodData[]> => {
  console.log('Mock API: fetchStructurizrAccessMethods called');
  const data: AccessMethodData[] = [
    { id: 'api', name: 'API', users: 350, rate: 1.94, color: '#2563eb' }, // Blue
    { id: 'cli', name: 'CLI', users: 100, rate: 0.94, color: '#ea580c' }, // Orange
    { id: 'mix', name: 'Mix of both', users: 500, rate: 8.94, color: '#dc2626' }, // Red
  ];
  return simulateDelay(data);
};

export const fetchStructurizrTopUsersChartData = async (
  filters?: Partial<FilterOptions>
): Promise<CategoricalChartData[]> => {
  console.log('Mock API: fetchStructurizrTopUsersChartData called with filters:', filters);
  const data: CategoricalChartData[] = [
    { name: 'saikaray', value: 70 }, { name: 'konadua', value: 65 },
    { name: 'browjose', value: 60 }, { name: 'elisha', value: 50 },
    { name: 'kassim', value: 45 }, { name: 'dorothye', value: 30 },
  ];
  return simulateDelay(data);
};