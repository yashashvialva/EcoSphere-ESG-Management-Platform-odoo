import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPolicies } from '../../services/governanceApi';
import { StatusBadge } from './components/GovernanceBadges';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 10 };
      if (status) params.status = status;
      if (search.trim()) params.search = search.trim();
      const res = await getPolicies(params);
      setPolicies(res.data.data || []);
      setPagination(res.data.pagination || { page, limit: 10, total: 0, totalPages: 0 });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load policies');
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => { fetchData(1); }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-emerald-50 to-teal-50/30 p-6 rounded-2xl border border-emerald-100/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm shadow-emerald-100"><FileText className="h-7 w-7 text-emerald-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">ESG Policies</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage and track company governance policies</p>
          </div>
        </div>
        <Link to="/governance/policies" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-200/50 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Create Policy
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <form onSubmit={handleSearch} className="flex flex-1 gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <input
                type="text"
                placeholder="Search by title or policy code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 pl-11 pr-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
            </div>
            <button type="submit" className="bg-white border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 text-emerald-700 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-emerald-100/50">Search</button>
          </form>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          {error} — <button onClick={() => fetchData(pagination.page)} className="underline font-semibold">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-emerald-50/50 rounded-xl animate-pulse" />)}</div>
        ) : policies.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-40 text-emerald-500" />
            <p className="font-semibold text-slate-600">No policies found</p>
            <p className="text-sm mt-1">Try adjusting your filters or create a new policy.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-50">
              <thead className="bg-emerald-50/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy Code</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Version</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Effective Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-emerald-700 whitespace-nowrap">{p.policyCode}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 max-w-[220px] truncate">{p.title}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">v{p.version}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">{p.effectiveDate ? new Date(p.effectiveDate).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">{p.ownerEmployee ? `${p.ownerEmployee.firstName} ${p.ownerEmployee.lastName}` : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/governance/policies/${p.id}`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View →</Link>
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
              Showing <span className="text-slate-800">{(pagination.page - 1) * pagination.limit + 1}</span>–<span className="text-slate-800">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-slate-800">{pagination.total}</span>
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
    </div>
  );
}
