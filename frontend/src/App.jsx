import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import EmissionFactorsPage from './modules/environmental/pages/EmissionFactorsPage';
import CarbonTransactionsPage from './modules/environmental/pages/CarbonTransactionsPage';
import EsgGoalsPage from './modules/environmental/pages/EsgGoalsPage';
import ProductProfilesPage from './modules/environmental/pages/ProductProfilesPage';
import EnvironmentalDashboard from './modules/environmental/pages/EnvironmentalDashboard';

// Placeholder Pages (To be implemented)
const LoginPage = () => <div className="p-8">Login Page Placeholder</div>;

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
        <Route path="dashboard" element={<ProtectedRoute requiredPermission="environmental.read"><EnvironmentalDashboard /></ProtectedRoute>} />
        
        {/* Developer 1 - Environmental Routes */}
        <Route path="environmental">
          <Route index element={<Navigate to="emission-factors" replace />} />
          <Route path="emission-factors" element={<ProtectedRoute requiredPermission="environmental.read"><EmissionFactorsPage /></ProtectedRoute>} />
          <Route path="carbon-transactions" element={<ProtectedRoute requiredPermission="environmental.read"><CarbonTransactionsPage /></ProtectedRoute>} />
          <Route path="esg-goals" element={<ProtectedRoute requiredPermission="environmental.read"><EsgGoalsPage /></ProtectedRoute>} />
          <Route path="product-profiles" element={<ProtectedRoute requiredPermission="environmental.read"><ProductProfilesPage /></ProtectedRoute>} />
        </Route>
        
        <Route path="unauthorized" element={<div className="p-8">You do not have permission to view this page.</div>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
