import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ClipboardCheck, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getAudits, createAudit } from '../../services/governanceApi';
import { StatusBadge, TypeBadge } from './components/GovernanceBadges';

export default function AuditsPage() {
  const [audits, setAudits] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({
    title: '',
    department: '',
    auditType: 'INTERNAL',
    auditorEmployeeId: '',
    scheduledDate: '',
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 10 };
      if (status) params.status = status;
      if (type) params.auditType = type;
      
      const res = await getAudits(params);
      setAudits(res.data.data || []);
      setPagination(res.data.pagination || { page, limit: 10, total: 0, totalPages: 0 });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load audits');
    } finally {
      setLoading(false);
    }
  }, [status, type]);

  useEffect(() => { fetchData(1); }, [status, type]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await createAudit({
        ...createData,
        scheduledDate: new Date(createData.scheduledDate).toISOString(),
      });
      setShowCreate(false);
      setCreateData({ title: '', department: '', auditType: 'INTERNAL', auditorEmployeeId: '', scheduledDate: '' });
      fetchData(1);
    } catch (err) {
      setCreateError(err.response?.data?.error?.message || 'Failed to create audit');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-emerald-50 to-teal-50/30 p-6 rounded-2xl border border-emerald-100/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm shadow-emerald-100"><ClipboardCheck className="h-7 w-7 text-emerald-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Governance Audits</h1>
            <p className="text-sm text-slate-500 mt-0.5">Schedule and review compliance and ESG audits</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-emerald-200/50 hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Schedule Audit
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 w-full sm:w-48 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 w-full sm:w-48 transition-colors"
          >
            <option value="">All Types</option>
            <option value="INTERNAL">Internal</option>
            <option value="EXTERNAL">External</option>
            <option value="COMPLIANCE">Compliance</option>
            <option value="ESG">ESG</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm">
          {error} — <button onClick={() => fetchData(pagination.page)} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-emerald-50/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : audits.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <ClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-40 text-emerald-500" />
            <p className="font-semibold text-slate-600">No audits found</p>
            <p className="text-sm mt-1">Try adjusting your filters or schedule a new audit.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-50">
              <thead className="bg-emerald-50/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Auditor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {audits.map((a) => (
                  <tr key={a.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 truncate max-w-[200px]">{a.title}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{a.department || '—'}</td>
                    <td className="px-6 py-4"><TypeBadge type={a.auditType} /></td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                      {a.auditorEmployee ? `${a.auditorEmployee.firstName} ${a.auditorEmployee.lastName}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                      {a.scheduledDate ? new Date(a.scheduledDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/governance/audits/${a.id}`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-emerald-50 bg-emerald-50/20">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="text-slate-800">{(pagination.page - 1) * pagination.limit + 1}</span>–
              <span className="text-slate-800">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="text-slate-800">{pagination.total}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchData(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-emerald-100/30"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                onClick={() => fetchData(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-emerald-100/30"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/10 w-full max-w-md overflow-hidden border border-emerald-100">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-b border-emerald-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-emerald-600" /> Schedule Audit</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-emerald-200">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              {createError && <div className="p-4 text-sm font-medium text-red-700 bg-red-50 border border-red-100 rounded-xl">{createError}</div>}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={createData.title}
                  onChange={e => setCreateData({...createData, title: e.target.value})}
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={createData.department}
                  onChange={e => setCreateData({...createData, department: e.target.value})}
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Audit Type *</label>
                <select
                  value={createData.auditType}
                  onChange={e => setCreateData({...createData, auditType: e.target.value})}
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                >
                  <option value="INTERNAL">Internal</option>
                  <option value="EXTERNAL">External</option>
                  <option value="COMPLIANCE">Compliance</option>
                  <option value="ESG">ESG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Auditor Employee UUID *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  value={createData.auditorEmployeeId}
                  onChange={e => setCreateData({...createData, auditorEmployeeId: e.target.value})}
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Scheduled Date *</label>
                <input
                  required
                  type="date"
                  value={createData.scheduledDate}
                  onChange={e => setCreateData({...createData, scheduledDate: e.target.value})}
                  className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-sm shadow-emerald-200/50"
                >
                  {creating ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
