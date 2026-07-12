import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, User, Calendar, Clock, Hash, CheckCircle, AlertTriangle, Send, Archive, Trash2 } from 'lucide-react';
import { getPolicyById, updatePolicyStatus, deletePolicy, getAcknowledgementStats, distributePolicy } from '../../services/governanceApi';
import { StatusBadge } from './components/GovernanceBadges';

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
      setPolicy(polRes.data);
      setStats(statsRes.data);
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
      setPolicy(res.data);
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
      setDistributeMsg(`Distributed to ${res.data?.distributed || ids.length} employee(s)`);
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
      <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
        <div className="h-6 w-32 bg-emerald-50 rounded animate-pulse" />
        <div className="h-24 bg-emerald-50 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-emerald-50/50 rounded-2xl animate-pulse" />)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto font-sans">
        <Link to="/governance/policies" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"><ArrowLeft className="h-4 w-4" /> Back to Policies</Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-700 font-semibold">{error}</p>
          <button onClick={load} className="mt-4 text-sm bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-6 py-2 font-semibold transition-all">Retry</button>
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
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      <Link to="/governance/policies" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Policies
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 bg-gradient-to-r from-emerald-50 to-teal-50/30 p-6 rounded-2xl border border-emerald-100/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm shadow-emerald-100 mt-1"><FileText className="h-7 w-7 text-emerald-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{policy.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status={policy.status} />
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">v{policy.version}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {policy.status === 'DRAFT' && (
            <>
              <button onClick={() => handleStatusChange('PUBLISHED')} disabled={actionLoading} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-emerald-200/50 disabled:opacity-50 hover:-translate-y-0.5">
                <Send className="h-4 w-4" /> Publish
              </button>
              <button onClick={handleDelete} disabled={actionLoading} className="inline-flex items-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-rose-100/50 disabled:opacity-50">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </>
          )}
          {policy.status === 'PUBLISHED' && (
            <>
              <button onClick={() => handleStatusChange('ARCHIVED')} disabled={actionLoading} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm disabled:opacity-50">
                <Archive className="h-4 w-4" /> Archive
              </button>
              <button onClick={() => setShowDistribute(!showDistribute)} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-emerald-200/50 hover:-translate-y-0.5">
                <Send className="h-4 w-4" /> Distribute
              </button>
            </>
          )}
        </div>
      </div>

      {showDistribute && (
        <form onSubmit={handleDistribute} className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-5 space-y-4 shadow-sm shadow-teal-100/30">
          <p className="text-sm font-semibold text-teal-800 flex items-center gap-2"><Send className="h-4 w-4" /> Distribute this policy to employees</p>
          <input
            type="text"
            placeholder="Comma-separated employee UUIDs"
            value={employeeIdsInput}
            onChange={(e) => setEmployeeIdsInput(e.target.value)}
            className="w-full rounded-xl border border-teal-200 bg-white/80 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
          />
          <div className="flex gap-3">
            <button type="submit" disabled={actionLoading} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5 py-2 text-sm font-semibold transition-all shadow-sm shadow-teal-200/50 disabled:opacity-50">Send</button>
            <button type="button" onClick={() => setShowDistribute(false)} className="bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 rounded-xl px-5 py-2 text-sm font-semibold transition-all">Cancel</button>
          </div>
        </form>
      )}

      {distributeMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-medium text-emerald-800 flex items-center gap-2 shadow-sm">
          <CheckCircle className="h-5 w-5 text-emerald-500" /> {distributeMsg}
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {info.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50/50 transition-colors">
              <div className="p-2 bg-emerald-50 rounded-lg shrink-0"><Icon className="h-4 w-4 text-emerald-600" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {policy.description && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
          <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-500" /> Description</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">{policy.description}</p>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-500" /> Policy Content</h2>
        <div className="prose prose-sm max-w-none prose-emerald prose-p:font-medium prose-p:text-slate-600 whitespace-pre-wrap p-5 bg-slate-50/50 rounded-xl border border-slate-100">{policy.content}</div>
      </div>

      {stats && (
        <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-100 p-6 mt-8">
          <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-600" /> Acknowledgement Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: stats.total, color: 'text-blue-700 bg-blue-100/50 border-blue-200' },
              { label: 'Acknowledged', value: stats.acknowledged, color: 'text-emerald-700 bg-emerald-100/50 border-emerald-200' },
              { label: 'Pending', value: stats.pending, color: 'text-amber-700 bg-amber-100/50 border-amber-200' },
              { label: 'Overdue', value: stats.overdue, color: 'text-rose-700 bg-rose-100/50 border-rose-200' },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-5 border ${s.color} flex flex-col items-center justify-center`}>
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-xs font-bold mt-2 tracking-wide uppercase opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
