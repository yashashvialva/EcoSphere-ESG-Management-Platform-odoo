import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

// Stub pages for milestone 1
const Dashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1></div>

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
        {/* Social Routes will be added here in Milestone 6 */}
      </Route>
    </Routes>
  )
}

export default App
