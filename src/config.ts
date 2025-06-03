// src/config.ts (New file)
export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api' // Your local Flask API base URL
  : '/api'; // Your production API base URL (if served from same domain or via proxy)

// Or if your Flask API isn't prefixed with /api in the URL path:
// export const API_BASE_URL = 'http://localhost:5000';