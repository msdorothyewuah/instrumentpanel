import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QueryProvider from './provider/QueryProvider';
import Layout from './components/layout/Layout';
import Overview from './components/pages/Overview';
import C4TSAnalytics from './components/pages/C4TSAnalytics';
import StructurizrAnalytics from './components/pages/StructurizrAnalytics';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/c4ts" element={<C4TSAnalytics />} />
          <Route path="/structurizr" element={<StructurizrAnalytics />} />
        </Routes>
      </Layout>
    </QueryProvider>
  );
}

export default App;