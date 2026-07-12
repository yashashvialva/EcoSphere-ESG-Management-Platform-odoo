import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

// Stub pages for milestone 1 & 2
const Dashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p>Welcome to the EcoSphere dashboard.</p></div>
const CsrStub = () => <div className="p-6"><h1 className="text-2xl font-bold">CSR Activities</h1><p className="mt-4 text-gray-600">The frontend for this section will be built in Milestone 6. The backend is already built!</p></div>
const TrainingStub = () => <div className="p-6"><h1 className="text-2xl font-bold">Training</h1><p className="mt-4 text-gray-600">This section will be built in Milestone 7.</p></div>
const DiversityStub = () => <div className="p-6"><h1 className="text-2xl font-bold">Diversity Metrics</h1><p className="mt-4 text-gray-600">This section will be built in Milestone 8.</p></div>

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
        <Route path="social/csr-activities" element={<CsrStub />} />
        <Route path="social/training" element={<TrainingStub />} />
        <Route path="social/diversity" element={<DiversityStub />} />
        <Route path="*" element={<div className="p-6">Page not found</div>} />
      </Route>
    </Routes>
  )
}

export default App
