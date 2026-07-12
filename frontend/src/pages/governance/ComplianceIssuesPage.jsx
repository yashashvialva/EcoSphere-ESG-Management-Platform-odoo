import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertTriangle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getComplianceIssues, createComplianceIssue } from '../../services/governanceApi';

const STATUS_COLORS = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-gray-100 text-gray-700',
};

const SEVERITY_COLORS = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

export default function ComplianceIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    severity: 'LOW',
    department: '',
    ownerEmployeeId: '',
    dueDate: '',
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 10 };
      if (status) params.status = status;
      if (severity) params.severity = severity;
      
      const res = await getComplianceIssues(params);
      setIssues(res.data.data || []);
      setPagination(res.data.pagination || { page, limit: 10, total: 0, totalPages: 0 });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load compliance issues');
    } finally {
      setLoading(false);
    }
  }, [status, severity]);

  useEffect(() => { fetchData(1); }, [status, severity]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const payload = { ...createData };
      if (payload.dueDate) payload.dueDate = new Date(payload.dueDate).toISOString();
      else delete payload.dueDate; // If not required or empty

      await createComplianceIssue(payload);
      setShowCreate(false);
      setCreateData({ title: '', description: '', severity: 'LOW', department: '', ownerEmployeeId: '', dueDate: '' });
      fetchData(1);
    } catch (err) {
      setCreateError(err.response?.data?.error?.message || 'Failed to create compliance issue');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-7 w-7 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Compliance Issues</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Report Issue
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-48"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-48"
          >
            <option value="">All Severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error} — <button onClick={() => fetchData(pagination.page)} className="underline font-medium">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No compliance issues found</p>
            <p className="text-sm mt-1">Try adjusting your filters or report a new issue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {issues.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-[200px]">{i.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{i.department || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[i.severity] || 'bg-gray-100 text-gray-700'}`}>
                        {i.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {i.dueDate ? new Date(i.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {i.ownerEmployee ? `${i.ownerEmployee.firstName} ${i.ownerEmployee.lastName}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[i.status] || 'bg-gray-100 text-gray-700'}`}>
                        {i.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/governance/compliance-issues/${i.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>–
              <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-medium">{pagination.total}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchData(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                onClick={() => fetchData(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden mt-8 mb-8">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Report Compliance Issue</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              {createError && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">{createError}</div>}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={createData.title}
                  onChange={e => setCreateData({...createData, title: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={createData.description}
                  onChange={e => setCreateData({...createData, description: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity *</label>
                  <select
                    value={createData.severity}
                    onChange={e => setCreateData({...createData, severity: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={createData.department}
                    onChange={e => setCreateData({...createData, department: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Employee UUID</label>
                <input
                  type="text"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  value={createData.ownerEmployeeId}
                  onChange={e => setCreateData({...createData, ownerEmployeeId: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={createData.dueDate}
                  onChange={e => setCreateData({...createData, dueDate: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {creating ? 'Reporting...' : 'Report Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
