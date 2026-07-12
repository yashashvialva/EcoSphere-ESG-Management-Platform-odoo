import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPolicies } from '../../services/governanceApi';

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-slate-100 text-slate-600',
};

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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">ESG Policies</h1>
        </div>
        <Link to="/governance/policies" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" /> Create Policy
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or policy code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors">Search</button>
          </form>
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
          <div className="p-6 space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : policies.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No policies found</p>
            <p className="text-sm mt-1">Try adjusting your filters or create a new policy.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 whitespace-nowrap">{p.policyCode}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[220px] truncate">{p.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || ''}`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.version}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{p.effectiveDate ? new Date(p.effectiveDate).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{p.ownerEmployee ? `${p.ownerEmployee.firstName} ${p.ownerEmployee.lastName}` : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/governance/policies/${p.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">View →</Link>
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
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>–<span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span>
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
    </div>
  );
}
