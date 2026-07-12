import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, User, Calendar, Clock, Hash, CheckCircle, AlertTriangle, Send, Archive, Trash2 } from 'lucide-react';
import { getPolicyById, updatePolicyStatus, deletePolicy, getAcknowledgementStats, distributePolicy } from '../../services/governanceApi';

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-slate-100 text-slate-600',
};

export default function PolicyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [policy, setPolicy] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDistribute, setShowDistribute] = useState(false);
  const [employeeIdsInput, setEmployeeIdsInput] = useState('');
  const [distributeMsg, setDistributeMsg] = useState(null);

  const load = async () => {
    try {
      setError(null);
      const [polRes, statsRes] = await Promise.all([
        getPolicyById(id),
        getAcknowledgementStats(id).catch(() => ({ data: { data: null } })),
      ]);
      setPolicy(polRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load policy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (newStatus) => {
    const labels = { PUBLISHED: 'publish', ARCHIVED: 'archive' };
    if (!window.confirm(`Are you sure you want to ${labels[newStatus] || 'update'} this policy?`)) return;
    try {
      setActionLoading(true);
      const res = await updatePolicyStatus(id, newStatus);
      setPolicy(res.data.data);
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to archive/delete this policy? This action cannot be undone.')) return;
    try {
      setActionLoading(true);
      await deletePolicy(id);
      navigate('/governance/policies');
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Delete failed');
      setActionLoading(false);
    }
  };

  const handleDistribute = async (e) => {
    e.preventDefault();
    const ids = employeeIdsInput.split(',').map(s => s.trim()).filter(Boolean);
    if (ids.length === 0) return;
    try {
      setActionLoading(true);
      const res = await distributePolicy(id, ids);
      setDistributeMsg(`Distributed to ${res.data.data?.distributed || ids.length} employee(s)`);
      setEmployeeIdsInput('');
      setShowDistribute(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Distribution failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-80 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Link to="/governance/policies" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={load} className="mt-3 text-sm text-red-600 underline">Retry</button>
        </div>
      </div>
    );
  }

  const info = [
    { label: 'Policy Code', value: policy.policyCode, icon: Hash },
    { label: 'Owner', value: policy.ownerEmployee ? `${policy.ownerEmployee.firstName} ${policy.ownerEmployee.lastName}` : '—', icon: User },
    { label: 'Effective Date', value: policy.effectiveDate ? new Date(policy.effectiveDate).toLocaleDateString() : '—', icon: Calendar },
    { label: 'Ack. Due Date', value: policy.acknowledgementDueDate ? new Date(policy.acknowledgementDueDate).toLocaleDateString() : '—', icon: Clock },
    { label: 'Created', value: new Date(policy.createdAt).toLocaleDateString(), icon: Calendar },
    { label: 'Last Updated', value: new Date(policy.updatedAt).toLocaleDateString(), icon: Calendar },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link to="/governance/policies" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Policies
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-50 rounded-lg mt-0.5"><FileText className="h-6 w-6 text-primary-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{policy.title}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[policy.status]}`}>{policy.status}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">v{policy.version}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {policy.status === 'DRAFT' && (
            <>
              <button onClick={() => handleStatusChange('PUBLISHED')} disabled={actionLoading} className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
                <Send className="h-4 w-4" /> Publish
              </button>
              <button onClick={handleDelete} disabled={actionLoading} className="inline-flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </>
          )}
          {policy.status === 'PUBLISHED' && (
            <>
              <button onClick={() => handleStatusChange('ARCHIVED')} disabled={actionLoading} className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
                <Archive className="h-4 w-4" /> Archive
              </button>
              <button onClick={() => setShowDistribute(!showDistribute)} className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                <Send className="h-4 w-4" /> Distribute
              </button>
            </>
          )}
        </div>
      </div>

      {/* Distribute Form */}
      {showDistribute && (
        <form onSubmit={handleDistribute} className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-blue-800">Distribute this policy to employees</p>
          <input
            type="text"
            placeholder="Comma-separated employee UUIDs"
            value={employeeIdsInput}
            onChange={(e) => setEmployeeIdsInput(e.target.value)}
            className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={actionLoading} className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">Send</button>
            <button type="button" onClick={() => setShowDistribute(false)} className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {/* Success message */}
      {distributeMsg && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> {distributeMsg}
        </div>
      )}

      {/* Info Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {info.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-gray-900 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      {policy.description && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{policy.description}</p>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Policy Content</h2>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{policy.content}</div>
      </div>

      {/* Acknowledgement Stats */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Acknowledgement Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: stats.total, color: 'text-blue-600 bg-blue-50' },
              { label: 'Acknowledged', value: stats.acknowledged, color: 'text-green-600 bg-green-50' },
              { label: 'Pending', value: stats.pending, color: 'text-amber-600 bg-amber-50' },
              { label: 'Overdue', value: stats.overdue, color: 'text-red-600 bg-red-50' },
            ].map((s) => (
              <div key={s.label} className={`rounded-lg p-4 ${s.color}`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs font-medium mt-1 opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
