import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import EmissionFactorsPage from './modules/environmental/pages/EmissionFactorsPage';

// Placeholder Pages (To be implemented)
const LoginPage = () => <div className="p-8">Login Page Placeholder</div>;
const Dashboard = () => <div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1></div>;

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Developer 1 - Environmental Routes */}
        <Route path="environmental" element={<ProtectedRoute requiredPermission="environmental.read"><EmissionFactorsPage /></ProtectedRoute>} />
        
        <Route path="unauthorized" element={<div className="p-8">You do not have permission to view this page.</div>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
