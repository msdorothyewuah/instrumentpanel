// src/server/db/index.ts

import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('structurizr-analytics');
  
  return { client, db };
}

export function getCollection(name: string) {
  if (!db) {
    throw new Error('Database connection not established');
  }
  return db.collection(name);
}