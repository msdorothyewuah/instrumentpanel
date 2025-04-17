import { useState } from 'react'
import './App.css'

function App() {
  const [activeSystem, setActiveSystem] = useState('overview')
  const [activeTab, setActiveTab] = useState('main')

  return (
    <div className="flex h-screen bg-gray-50">
      {/* This is a placeholder for the layout components */}
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-lg font-bold text-blue-600">C4 Analytics</h2>
        <div className="mt-4">
          <p>Sidebar Navigation (Coming Soon)</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 border-b">
          <h1 className="text-lg font-semibold">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Header Component (Coming Soon)</p>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded p-4 shadow">
                <h3 className="text-gray-500">{metric.title}</h3>
                <div className="text-2xl font-bold mt-2">{metric.value}</div>
              </div>
            ))}
          </div>
          
          <p className="mt-8 text-center text-gray-500">Dashboard Content (Coming Soon)</p>
        </main>
        
        <footer className="bg-white p-4 border-t">
          <p className="text-sm text-gray-500">Footer Component (Coming Soon)</p>
        </footer>
      </div>
    </div>
  )
}

export default App

// Temporary mock data until we import from the data folder
const overviewMetrics = [
  { title: 'Total API Hits (C4TS)', value: '1,079', change: '+8%', color: 'bg-blue-500' },
  { title: 'Active Workspaces', value: '36', change: '+6%', color: 'bg-green-500' },
  { title: 'Total Users', value: '48', change: '+4%', color: 'bg-purple-500' },
  { title: 'System Health', value: '99.8%', change: '+0.2%', color: 'bg-amber-500' },
];