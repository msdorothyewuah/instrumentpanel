import Layout from './components/layout/Layout'
import Overview from './components/pages/Overview'
import C4TSAnalytics from './components/pages/C4TSAnalytics'
import StructurizrAnalytics from './components/pages/StructurizrAnalytics'
import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/c4ts" element={<C4TSAnalytics />} />
          <Route path="/structurizr" element={<StructurizrAnalytics />} />
        </Routes>
      </Layout>
    )
  }

export default App
