// src/server/db/models/workspace.ts

import { ObjectId } from 'mongodb';
import { getCollection, connectToDatabase } from '../index';

export interface Workspace {
  _id?: ObjectId;
  workspaceId: number;
  name: string;
  description?: string;
  owner: string;
  createdAt: Date;
  lastUpdated?: Date;
  apiHits?: number;
  active: boolean;
}

export type TimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all-time';

export async function getWorkspaces() {
  await connectToDatabase();
  const collection = getCollection('workspaces');
  return collection.find({}).toArray();
}

export async function getActiveWorkspaces() {
  await connectToDatabase();
  const collection = getCollection('workspaces');
  return collection.find({ active: true }).toArray();
}

export async function getWorkspaceStats(timeRange: TimeRange) {
  await connectToDatabase();
  const collection = getCollection('workspaces');
  
  // Define date cutoff based on timeRange
  const dateFilter = new Date();
  switch (timeRange) {
    case 'day':
      dateFilter.setDate(dateFilter.getDate() - 1);
      break;
    case 'week':
      dateFilter.setDate(dateFilter.getDate() - 7);
      break;
    case 'month':
      dateFilter.setMonth(dateFilter.getMonth() - 1);
      break;
    case 'quarter':
      dateFilter.setMonth(dateFilter.getMonth() - 3);
      break;
    case 'year':
      dateFilter.setFullYear(dateFilter.getFullYear() - 1);
      break;
    case 'all-time':
      dateFilter.setFullYear(2000); // Effectively no limit
      break;
  }
  
  // Aggregation pipeline for analytics
  const result = await collection.aggregate([
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
}

export async function getTotalCount() {
  await connectToDatabase();
  const collection = getCollection('workspaces');
  return collection.countDocuments({ active: true });
}

export async function getRecentWorkspaces(limit = 5) {
  await connectToDatabase();
  const collection = getCollection('workspaces');
  return collection.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}