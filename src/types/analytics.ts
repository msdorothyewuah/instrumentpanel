import { Trend } from './common';

export interface DataPoint {
  date: string;
  value: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface OverviewStats {
  totalApiHits: {
    value: number;
    trend: Trend;
  };
  activeWorkspaces: {
    value: number;
    trend: Trend;
  };
  totalUsers: {
    value: number;
    trend: Trend;
  };
  totalDepartments: {
    value: number;
    trend: Trend;
  };
}

export interface C4TSData {
  apiHitsOverTime: DataPoint[];
  topEndpoints: {
    url: string;
    hits: number;
  }[];
  topUsers: {
    name: string;
    hits: number;
  }[];
}

export interface StructurizrData {
  workspacesOverTime: {
    active: DataPoint[];
    created: DataPoint[];
    deleted: DataPoint[];
  };
  accessMethods: {
    name: string;
    users: number;
    rate: number;
  }[];
  topUsers: {
    name: string;
    workspaces: number;
  }[];
}