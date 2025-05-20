// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import QueryProvider from './QueryProvider';
import Layout from './components/Layout'; // Import your Layout component
import Overview from './components/Overview';
import StructurizrAnalytics from './components/StructurizrAnalytics';
import C4TSAnalytics from './components/C4TSAnalytics'; // Import your C4 component

// Create a theme instance (or use your existing theme)
const theme = createTheme({
  palette: {
    primary: {
      main: '#3182CE', // Blue shade
    },
    secondary: {
      main: '#4FD1C5', // Teal shade
    },
    background: {
      default: '#F7FAFC', // Light gray background
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
      },
    },
  },
});

function App() {
  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/c4ts" element={<C4TSAnalytics />} />
              <Route path="/structurizr" element={<StructurizrAnalytics />} />
              {/* Add other routes as needed */}
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;