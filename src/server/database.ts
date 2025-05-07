// src/server/database.ts

import { MongoClient, Collection, Db, ObjectId } from "mongodb";

export type TimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all-time';

export interface Workspace {
  _id?: ObjectId;
  workspaceId: number;
  name: string;
  owner: string;
  createdAt: Date;
  lastUpdated?: Date;
  active: boolean;
}

interface AnalyticsDataPoint {
  date: string;
  count: number;
}

class WorkspaceDatabase {
  private client: MongoClient;
  private workspaces: Collection;

  private constructor(client: MongoClient, workspaces: Collection) {
    this.client = client;
    this.workspaces = workspaces;
  }

  static connect = async (): Promise<WorkspaceDatabase> => {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME;
    
    if (!uri) throw new Error("MONGODB_URI is not defined");
    if (!dbName) throw new Error("MONGODB_DB_NAME is not defined");
    
    const client = new MongoClient(uri);
    await client.connect();
    const db: Db = client.db(dbName);
    return new WorkspaceDatabase(client, db.collection("workspaces"));
  };

  getAllWorkspaces = async () => {
    const result = await this.workspaces.find({
      active: true
    }).toArray();
    console.log('Database getAllWorkspaces result:', result.length);
    return result;
  };

  getWorkspaceAnalytics = async (timeRange: TimeRange): Promise<AnalyticsDataPoint[]> => {
    const dateFilter = new Date();
    
    switch (timeRange) {
      case "day":
        dateFilter.setDate(dateFilter.getDate() - 1);
        break;
      case "week":
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case "month":
        dateFilter.setMonth(dateFilter.getMonth() - 1);
        break;
      case "quarter":
        dateFilter.setMonth(dateRange.getMonth() - 3);
        break;
      case "year":
        dateFilter.setFullYear(dateFilter.getFullYear() - 1);
        break;
      case "all-time":
        dateFilter.setFullYear(2000); // Effectively no limit
        break;
    }

    const result = await this.workspaces.aggregate([
      { 
        $match: { 
          createdAt: { $gte: dateFilter },
          active: true 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]).toArray();

    return result.map(({ _id, count }) => ({
      date: `${_id.year}-${String(_id.month).padStart(2, "0")}-${String(_id.day).padStart(2, "0")}`,
      count
    }));
  };

  getWorkspaceCount = async () => {
    return await this.workspaces.countDocuments({ active: true });
  };

  getActiveWorkspaces = async (days = 30) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return await this.workspaces.countDocuments({
      lastUpdated: { $gte: cutoff },
      active: true
    });
  };

  close = async () => {
    await this.client.close();
  };
}

export default WorkspaceDatabase;