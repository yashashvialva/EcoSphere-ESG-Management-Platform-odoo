import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Environmental Pages
import EmissionFactorsPage from './modules/environmental/pages/EmissionFactorsPage';
import CarbonTransactionsPage from './modules/environmental/pages/CarbonTransactionsPage';
import EsgGoalsPage from './modules/environmental/pages/EsgGoalsPage';
import ProductProfilesPage from './modules/environmental/pages/ProductProfilesPage';
import EnvironmentalDashboard from './modules/environmental/pages/EnvironmentalDashboard';

// Social Pages
import CsrActivityList from './modules/social/pages/CsrActivityList';
import CsrActivityDetail from './modules/social/pages/CsrActivityDetail';
import TrainingList from './modules/social/pages/TrainingList';
import DiversityDashboard from './modules/social/pages/DiversityDashboard';

import LoginPage from './modules/auth/pages/LoginPage';

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

        {/* Developer 2 - Social Routes */}
        <Route path="social">
          <Route path="csr-activities" element={<ProtectedRoute><CsrActivityList /></ProtectedRoute>} />
          <Route path="csr-activities/:id" element={<ProtectedRoute><CsrActivityDetail /></ProtectedRoute>} />
          <Route path="training" element={<ProtectedRoute><TrainingList /></ProtectedRoute>} />
          <Route path="diversity" element={<ProtectedRoute><DiversityDashboard /></ProtectedRoute>} />
        </Route>
        
        <Route path="unauthorized" element={<div className="p-8">You do not have permission to view this page.</div>} />
        <Route path="*" element={<div className="p-6">Page not found</div>} />
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
