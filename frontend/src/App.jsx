import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

const Dashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p>Welcome to the EcoSphere dashboard.</p></div>
const DiversityStub = () => <div className="p-6"><h1 className="text-2xl font-bold">Diversity Metrics</h1><p className="mt-4 text-gray-600">This section will be built in Milestone 8.</p></div>

import CsrActivityList from './modules/social/pages/CsrActivityList'
import CsrActivityDetail from './modules/social/pages/CsrActivityDetail'
import TrainingList from './modules/social/pages/TrainingList'
import DiversityDashboard from './modules/social/pages/DiversityDashboard'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="social/csr-activities" element={<CsrActivityList />} />
        <Route path="social/csr-activities/:id" element={<CsrActivityDetail />} />
        <Route path="social/training" element={<TrainingList />} />
        <Route path="social/diversity" element={<DiversityDashboard />} />
        <Route path="*" element={<div className="p-6">Page not found</div>} />
      </Route>
    </Routes>
  )
}

export default App
