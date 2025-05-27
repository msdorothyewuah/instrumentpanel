// src/services/apiService.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Common Interfaces (align with backend) ---
export interface StatItem {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ChartDataPointDateCount { // For C4TS charts and simple Structurizr counts
  date: string; // YYYY-MM-DD
  count: number;
}

export interface StructurizrActivityChartDataPoint { // For Structurizr overview/creation chart
  date: string; // YYYY-MM-DD
  active: number;
  created: number;
  deleted: number;
}

export interface OverviewUserTableRow {
  user: string;
  department: string;
  c4tsApiHits: number;
  structurizrWorkspaces: number;
}

export interface StructurizrAccessMethod {
  pageName: string;
  totalUsers: number;
  rate: string;
}

export interface StructurizrAccessMethodData {
  tableData: StructurizrAccessMethod[];
  // chartData?: { name: string; value: number }[]; // If you add chart data later
}

export interface UserActivityChartDataPoint { // For Structurizr/C4TS top user bar charts
  user: string;
  workspaces?: number; // For Structurizr
  hits?: number;       // For C4TS
}

export interface C4TSApiHitURLRow {
  url: string;
  hits: number;
}

// --- Specific Interface for the Raw Structurizr Workspaces Data ---
export interface StructurizrWorkspaceRaw {
  _id: string; // Assuming it's converted to string by backend
  instance: string;
  workspaceID: number;
  eonID: string;
  readRow: string;
  writeRow: string;
  archived: string; // Assuming string 'true'/'false'
  // Add any other fields that come from your DB for a workspace
}

export interface RawStructurizrWorkspacesResponse {
  result: {
    data: {
      JSON: StructurizrWorkspaceRaw[];
    };
  };
}
// Note: The backend sends an array containing one such object: [RawStructurizrWorkspacesResponse]
// So the actual type fetched would be RawStructurizrWorkspacesResponse[]

// --- Filter Parameters Interface ---
export interface FilterParams {
  timeframe?: string;
  department?: string;
  region?: string;
  // Add other potential filters
}

const buildQueryString = (filters?: FilterParams): string => {
  if (!filters) return '';
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  return params.toString() ? `?${params.toString()}` : '';
};

async function fetchData<T>(endpoint: string, filters?: FilterParams): Promise<T> {
  const queryString = buildQueryString(filters);
  const response = await fetch(`${API_BASE_URL}${endpoint}${queryString}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to fetch data from ${endpoint}`);
  }
  return response.json() as Promise<T>;
}

// ======= OVERVIEW PAGE FETCH FUNCTIONS =======
export const fetchOverviewStats = (filters?: FilterParams): Promise<StatItem[]> => {
  return fetchData<StatItem[]>('/overview/stats', filters);
};
export const fetchOverviewC4TSChartData = (filters?: FilterParams): Promise<ChartDataPointDateCount[]> => {
  return fetchData<ChartDataPointDateCount[]>('/overview/c4ts-chart', filters);
};
export const fetchOverviewStructurizrChartData = (filters?: FilterParams): Promise<StructurizrActivityChartDataPoint[]> => {
  return fetchData<StructurizrActivityChartDataPoint[]>('/overview/structurizr-chart', filters);
};
export const fetchOverviewTopUsersTable = (): Promise<OverviewUserTableRow[]> => {
  return fetchData<OverviewUserTableRow[]>('/overview/top-users-table');
};

// ======= STRUCTURIZR ANALYTICS PAGE FETCH FUNCTIONS =======
export const fetchStructurizrPageStats = (filters?: FilterParams): Promise<StatItem[]> => {
  return fetchData<StatItem[]>('/structurizr/page-stats', filters);
};

// Specific function for the raw, nested Structurizr data
export const fetchRawStructurizrWorkspaces = async (filters?: FilterParams): Promise<StructurizrWorkspaceRaw[]> => {
  // The backend returns an array: [RawStructurizrWorkspacesResponse]
  const responseArray = await fetchData<RawStructurizrWorkspacesResponse[]>('/structurizr/raw-workspaces-data', filters);
  if (responseArray && responseArray.length > 0 && responseArray[0].result && responseArray[0].result.data) {
    return responseArray[0].result.data.JSON;
  }
  return []; // Return empty array if structure is not as expected or empty
};

export const fetchStructurizrWorkspaceCreationChartData = (filters?: FilterParams): Promise<StructurizrActivityChartDataPoint[]> => {
  return fetchData<StructurizrActivityChartDataPoint[]>('/structurizr/workspace-creation-chart', filters);
};
export const fetchStructurizrAccessMethodsData = (): Promise<StructurizrAccessMethodData> => {
  return fetchData<StructurizrAccessMethodData>('/structurizr/access-methods');
};
export const fetchStructurizrTopUsersChartData = (): Promise<UserActivityChartDataPoint[]> => {
  return fetchData<UserActivityChartDataPoint[]>('/structurizr/top-users-chart');
};

// ======= C4TS ANALYTICS PAGE FETCH FUNCTIONS (using ChartDataPointDateCount for simple counts) =======
export const fetchC4TSPageStats = (filters?: FilterParams): Promise<StatItem[]> => {
  return fetchData<StatItem[]>('/c4ts/page-stats', filters);
};
export const fetchC4TSApiHitsChartData = (filters?: FilterParams): Promise<ChartDataPointDateCount[]> => {
  return fetchData<ChartDataPointDateCount[]>('/c4ts/api-hits-chart', filters);
};
export const fetchC4TSTopUsersChartData = (): Promise<UserActivityChartDataPoint[]> => {
  return fetchData<UserActivityChartDataPoint[]>('/c4ts/top-users-chart');
};
export const fetchC4TSApiHitsUrlTable = (): Promise<C4TSApiHitURLRow[]> => {
  return fetchData<C4TSApiHitURLRow[]>('/c4ts/api-hits-url-table');
};