// server/src/index.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient, Db, ObjectId, Collection } from 'mongodb'; // ObjectId might be needed later

dotenv.config({ path: '../.env' }); // Load .env from server folder root

const app = express();
const port = process.env.PORT || 3001;

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

let db: Db;
const client = new MongoClient(mongoUri);

async function connectDB() {
  try {
    await client.connect();
    const dbNameFromUri = mongoUri.split('/').pop()?.split('?')[0];
    db = client.db(dbNameFromUri || 'yourAnalyticsDatabaseName'); // Ensure this matches your actual DB name
    console.log(`Successfully connected to MongoDB database: ${db.databaseName}!`);
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

app.use(cors({ origin: 'http://localhost:5173' })); // Adjust if your React app runs on a different port
app.use(express.json());

// --- Helper Functions (Mock Data Generators) ---
const generateDateCountData = (days: number, maxCount: number) => {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      count: Math.floor(Math.random() * maxCount) + 1,
    });
  }
  return data;
};

const generateStructurizrDateActivityData = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      active: Math.floor(Math.random() * 50) + 10,
      created: Math.floor(Math.random() * 10) + 1,
      deleted: Math.floor(Math.random() * 5),
    });
  }
  return data;
};

// --- Helper to safely query collection ---
async function queryCollection<T>(collectionName: string, query: object = {}, projection?: object, sort?: object, limit?: number): Promise<T[] | null> {
  try {
    if (!db) {
      console.warn(`Database not connected while trying to query ${collectionName}`);
      return null;
    }
    const collection: Collection = db.collection(collectionName);
    let cursor = collection.find(query);
    if (projection) cursor = cursor.project(projection);
    if (sort) cursor = cursor.sort(sort);
    if (limit) cursor = cursor.limit(limit);
    const data = await cursor.toArray();
    return data.length > 0 ? data as T[] : null;
  } catch (error) {
    console.error(`Error querying collection ${collectionName}:`, error);
    return null;
  }
}

async function countDocuments(collectionName: string, query: object = {}): Promise<number | null> {
    try {
        if (!db) {
            console.warn(`Database not connected while trying to count ${collectionName}`);
            return null;
        }
        const collection: Collection = db.collection(collectionName);
        const count = await collection.countDocuments(query);
        return count;
    } catch (error) {
        console.error(`Error counting documents in ${collectionName}:`, error);
        return null;
    }
}

// --- API Routes ---

// ======= OVERVIEW PAGE ENDPOINTS =======
app.get('/api/overview/stats', async (req: Request, res: Response) => {
  console.log('GET /api/overview/stats received filters:', req.query);
  try {
    // Structurizr data from DB
    const activeWorkspacesStructurizr = await countDocuments('structurizrWorkspaces', { archived: "false" }) || 0; // COLLECTION_NAME: structurizrWorkspaces
    const totalUsersStructurizr = await db?.collection('structurizrWorkspaces').distinct('owner').then(owners => owners.length) || 0; // Assuming 'owner' field for users

    // C4TS Data (Hardcoded for now)
    const totalApiHitsC4TS = 1567; // Hardcoded
    const totalUsersC4TS = 78; // Hardcoded (example, adjust as needed)

    // General Data (can be from a 'users' collection or combination)
    const totalUsers = Math.max(totalUsersStructurizr, totalUsersC4TS, await countDocuments('globalUsers') || 0); // Example combining or from a global user list
    const totalDepartments = await db?.collection('globalUsers').distinct('department').then(deps => deps.length) || 5; // Example or hardcoded

    const stats = [
      { title: "Total API Hits (C4TS)", value: totalApiHitsC4TS.toString(), trend: { value: 10.0, isPositive: true } },
      { title: "Active Workspace (Structurizr)", value: activeWorkspacesStructurizr.toString(), trend: { value: 3.0, isPositive: false } },
      { title: "Total Users", value: totalUsers.toString(), trend: { value: 3.2, isPositive: true } },
      { title: "Total Departments", value: totalDepartments.toString(), trend: { value: 8.3, isPositive: true } }
    ];
    res.json(stats);
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    res.status(500).json({ message: 'Failed to fetch overview stats' });
  }
});

app.get('/api/overview/c4ts-chart', async (req: Request, res: Response) => {
  // C4TS Data (Hardcoded for now)
  console.log('GET /api/overview/c4ts-chart (hardcoded) received filters:', req.query);
  try {
    res.json(generateDateCountData(30, 300)); // Mock data for last 30 days, max 300 hits
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch C4TS chart data' });
  }
});

app.get('/api/overview/structurizr-chart', async (req: Request, res: Response) => {
  console.log('GET /api/overview/structurizr-chart received filters:', req.query);
  try {
    // Attempt to fetch and aggregate real data from 'structurizrWorkspaces'
    // Example: group by date, count active, created, deleted
    // This can be complex, so using mock as a placeholder until specific aggregation is defined
    const realChartData = null; // Placeholder for actual DB aggregation query result
    if (realChartData) {
        // res.json(transformRealDataToChartFormat(realChartData));
    } else {
        res.json(generateStructurizrDateActivityData(30)); // Fallback to mock
    }
  } catch (error) {
    console.error("Error fetching Structurizr chart data for overview:", error);
    res.status(500).json({ message: 'Failed to fetch Structurizr chart data' });
  }
});

app.get('/api/overview/top-users-table', async (req: Request, res: Response) => {
  try {
    // Structurizr part from DB (example: top workspace owners)
    const topStructurizrOwners = await db?.collection('structurizrWorkspaces')
      .aggregate([
        { $group: { _id: "$owner", count: { $sum: 1 } } }, // COLLECTION_NAME: structurizrWorkspaces, FIELD: owner
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { user: "$_id", structurizrWorkspaces: "$count", _id: 0 } }
      ]).toArray();

    // C4TS part (Hardcoded)
    const c4tsUserHits = [
      { user: "User A", c4tsApiHits: 89, department: "ETS" },
      { user: "User B", c4tsApiHits: 87, department: "TOR" },
      { user: "User C", c4tsApiHits: 56, department: "ETS" },
      { user: "dorothye", c4tsApiHits: 120, department: "FIN"}, // Example
      { user: "saakaray", c4tsApiHits: 95, department: "DEV"}  // Example
    ];

    // Combine/Merge logic (this is a simplified example)
    const combinedUsers: any[] = [];
    const userMap = new Map();

    c4tsUserHits.forEach(u => userMap.set(u.user, { ...u, structurizrWorkspaces: 0 }));
    topStructurizrOwners?.forEach(u => {
      if (userMap.has(u.user)) {
        userMap.get(u.user).structurizrWorkspaces = u.structurizrWorkspaces;
      } else {
        userMap.set(u.user, { user: u.user, c4tsApiHits: 0, structurizrWorkspaces: u.structurizrWorkspaces, department: "Unknown" });
      }
    });
    
    userMap.forEach(value => combinedUsers.push(value));

    res.json(combinedUsers.slice(0, 5)); // Send top 5 combined/merged users
  } catch (error) {
    console.error("Error fetching top users table for overview:", error);
    res.status(500).json({ message: 'Failed to fetch top users table' });
  }
});


// ======= STRUCTURIZR ANALYTICS PAGE ENDPOINTS (Primary focus on DB) =======
// COLLECTION_NAME for all Structurizr data: 'structurizrWorkspaces'

// This specific endpoint will return the nested structure
app.get('/api/structurizr/raw-workspaces-data', async (req: Request, res: Response) => {
  try {
    const workspaces = await queryCollection<{ _id: ObjectId | string; instance: string; workspaceID: number; eonID: string; readRow: string; writeRow: string; archived: string; }>
      ('structurizrWorkspaces', {}, { projection: { _id: 1, instance: 1, workspaceID: 1, eonID: 1, readRow: 1, writeRow: 1, archived: 1 }});

    if (workspaces) {
      res.json([
        {
          result: {
            data: {
              JSON: workspaces.map(ws => ({
                ...ws,
                _id: ws._id.toString()
              }))
            }
          }
        }
      ]);
    } else {
      // Fallback to your example hardcoded data if DB is empty or query fails
      res.json([
        {
          "result": {
            "data": {
              "JSON": [
                { "_id": "64f1a2bcd0e5e8a5f3d8a7e1", "instance": "server-1", "workspaceID": 101, "eonID": "5001", "readRow": "user-role", "writeRow": "admin-role", "archived": "false" },
                { "_id": "64f1a2bcd0e5e8a5f3d8a7e2", "instance": "server-2", "workspaceID": 102, "eonID": "5002", "readRow": "viewer-role", "writeRow": "editor-role", "archived": "true" }
              ]
            }
          }
        }
      ]);
    }
  } catch (error) {
    console.error("Error fetching Structurizr raw workspaces data:", error);
    res.status(500).json({ message: 'Failed to fetch Structurizr raw workspaces data' });
  }
});

app.get('/api/structurizr/page-stats', async (req: Request, res: Response) => {
  console.log('GET /api/structurizr/page-stats received filters:', req.query);
  try {
    const activeCount = await countDocuments('structurizrWorkspaces', { archived: "false" }) || 0;
    // Add queries for "Created This Period", "Avg. Daily Creation", "Deleted This Period"
    // These would involve date range queries on 'createdAt' and 'deletedAt' (if you have it) fields.
    // Example: const createdThisMonth = await countDocuments('structurizrWorkspaces', { createdAt: { $gte: oneMonthAgo } });

    res.json([
        { title: "Active Workspaces", value: activeCount.toString(), trend: { value: 3.0, isPositive: false } },
        { title: "Created This Period", value: "12", trend: { value: 5.0, isPositive: true } }, // Mocked for now
        { title: "Avg. Daily Creation", value: "2.1", trend: { value: 1.5, isPositive: true } },// Mocked
        { title: "Deleted This Period", value: "3", trend: { value: -2.0, isPositive: true } } // Mocked
    ]);
  } catch (error) {
    console.error("Error fetching Structurizr page stats:", error);
    res.status(500).json({ message: 'Failed to fetch Structurizr page stats' });
  }
});

app.get('/api/structurizr/workspace-creation-chart', async (req: Request, res: Response) => {
  console.log('GET /api/structurizr/workspace-creation-chart received filters:', req.query);
  try {
    // Real aggregation for active, created, deleted over time for 'structurizrWorkspaces'
    // This is complex and depends on your data structure (createdAt, status changes, deletedAt fields)
    const realChartData = null; // Placeholder
    if (realChartData) {
        // res.json(realChartData);
    } else {
        res.json(generateStructurizrDateActivityData(30)); // Fallback to mock
    }
  } catch (error) {
    console.error("Error fetching Structurizr workspace creation chart:", error);
    res.status(500).json({ message: 'Failed to fetch Structurizr workspace creation chart' });
  }
});

app.get('/api/structurizr/access-methods', async (req: Request, res: Response) => {
  try {
    // Query 'structurizrWorkspaces' or access logs for how they were accessed (e.g., 'accessMethod' field: 'API', 'CLI')
    // const apiAccessCount = await countDocuments('structurizrWorkspaces', { accessMethod: 'API' });
    // const cliAccessCount = await countDocuments('structurizrWorkspaces', { accessMethod: 'CLI' });
    // ... calculate rates etc.
    res.json({
      tableData: [
        { pageName: "API", totalUsers: 350, rate: "1.94%" }, // Mocked for now
        { pageName: "CLI", totalUsers: 100, rate: "0.94%" }, // Mocked
        { pageName: "Mix of both", totalUsers: 500, rate: "8.94%" }, // Mocked
      ]
    });
  } catch (error) {
    console.error("Error fetching Structurizr access methods:", error);
    res.status(500).json({ message: 'Failed to fetch Structurizr access methods' });
  }
});

app.get('/api/structurizr/top-users-chart', async (req: Request, res: Response) => {
  try {
    const topOwners = await db?.collection('structurizrWorkspaces')
      .aggregate([
        { $group: { _id: "$owner", count: { $sum: 1 } } }, // FIELD: owner
        { $sort: { count: -1 } },
        { $limit: 6 },
        { $project: { user: "$_id", workspaces: "$count", _id: 0 } }
      ]).toArray();
    
    if (topOwners && topOwners.length > 0) {
        res.json(topOwners);
    } else {
        res.json([ // Fallback mock
            { user: 'browjose', workspaces: 15 }, { user: 'dorothye', workspaces: 12 },
            { user: 'konadua', workspaces: 10 }, { user: 'saakaray', workspaces: 8 },
        ]);
    }
  } catch (error) {
    console.error("Error fetching Structurizr top users chart:", error);
    res.status(500).json({ message: 'Failed to fetch Structurizr top users chart' });
  }
});


// ======= C4TS ANALYTICS PAGE ENDPOINTS (All Hardcoded/Mock for now) =======
app.get('/api/c4ts/page-stats', async (req: Request, res: Response) => {
  console.log('GET /api/c4ts/page-stats (hardcoded) received filters:', req.query);
  try {
    res.json([
      { title: "Total API Hits", value: "12,345", trend: { value: 12.5, isPositive: true } },
      { title: "Unique Users", value: "230", trend: { value: 5.2, isPositive: true } },
      { title: "Avg. Hits per User", value: "53.6", trend: { value: 2.1, isPositive: true } },
      { title: "Most Active Endpoint", value: "/api/v2/translate", trend: { value: 0, isPositive: true} }
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch C4TS page stats' });
  }
});

app.get('/api/c4ts/api-hits-chart', async (req: Request, res: Response) => {
  console.log('GET /api/c4ts/api-hits-chart (hardcoded) received filters:', req.query);
  try {
    res.json(generateDateCountData(30, 500));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch C4TS API hits chart' });
  }
});

app.get('/api/c4ts/top-users-chart', async (req: Request, res: Response) => {
    console.log('GET /api/c4ts/top-users-chart (hardcoded)');
  try {
    res.json([
      { user: 'dorothye', hits: 1200 }, { user: 'elisha', hits: 1100 },
      { user: 'browjose', hits: 950 }, { user: 'konadua', hits: 900 },
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch C4TS top users chart' });
  }
});

app.get('/api/c4ts/api-hits-url-table', async (req: Request, res: Response) => {
    console.log('GET /api/c4ts/api-hits-url-table (hardcoded)');
  try {
    res.json([
      { url: "api/v2/translation", hits: 890 }, { url: "api/v1/export", hits: 870 },
      { url: "api/v1/translation", hits: 560 }, { url: "api/v2/workspaces", hits: 450 },
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch C4TS API hits URL table' });
  }
});

// --- Start Server ---
async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
  });
}

startServer();