import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

// Governance pages
import GovernanceDashboard from './pages/governance/GovernanceDashboard'
import PoliciesPage from './pages/governance/PoliciesPage'
import PolicyDetailPage from './pages/governance/PolicyDetailPage'
import AcknowledgementsPage from './pages/governance/AcknowledgementsPage'
import AuditsPage from './pages/governance/AuditsPage'
import AuditDetailPage from './pages/governance/AuditDetailPage'
import ComplianceIssuesPage from './pages/governance/ComplianceIssuesPage'
import ComplianceIssueDetailPage from './pages/governance/ComplianceIssueDetailPage'

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

        {/* Governance Routes */}
        <Route path="governance" element={<GovernanceDashboard />} />
        <Route path="governance/policies" element={<PoliciesPage />} />
        <Route path="governance/policies/:id" element={<PolicyDetailPage />} />
        <Route path="governance/acknowledgements" element={<AcknowledgementsPage />} />
        <Route path="governance/audits" element={<AuditsPage />} />
        <Route path="governance/audits/:id" element={<AuditDetailPage />} />
        <Route path="governance/compliance-issues" element={<ComplianceIssuesPage />} />
        <Route path="governance/compliance-issues/:id" element={<ComplianceIssueDetailPage />} />

        {/* Social Routes will be added here in Milestone 6 */}
      </Route>
    </Routes>
  )
}

export default App
