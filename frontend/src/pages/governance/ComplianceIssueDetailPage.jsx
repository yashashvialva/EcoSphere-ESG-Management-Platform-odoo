import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, User, Calendar, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { getComplianceIssueById, updateComplianceIssueStatus, resolveComplianceIssue } from '../../services/governanceApi';
import { StatusBadge, SeverityBadge } from './components/GovernanceBadges';

export default function ComplianceIssueDetailPage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showResolveForm, setShowResolveForm] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getComplianceIssueById(id);
      setIssue(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load compliance issue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Change status to ${newStatus}?`)) return;
    try {
      setActionLoading(true);
      await updateComplianceIssueStatus(id, { status: newStatus });
      await load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await resolveComplianceIssue(id, { resolutionNotes });
      setShowResolveForm(false);
      await load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to resolve issue');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
        <div className="h-6 w-32 bg-emerald-50 rounded animate-pulse" />
        <div className="h-24 bg-emerald-50 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-emerald-50/50 rounded-2xl animate-pulse" />)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto font-sans">
        <Link to="/governance/compliance-issues" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-700 font-semibold">{error}</p>
          <button onClick={load} className="mt-4 text-sm bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-6 py-2 font-semibold transition-all">Retry</button>
        </div>
      </div>
    );
  }

  const info = [
    { label: 'Reported By', value: issue.reportedBy ? `${issue.reportedBy.firstName} ${issue.reportedBy.lastName}` : '—', icon: User },
    { label: 'Assigned To', value: issue.assignedTo ? `${issue.assignedTo.firstName} ${issue.assignedTo.lastName}` : 'Unassigned', icon: User },
    { label: 'Due Date', value: issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '—', icon: Clock },
    { label: 'Reported Date', value: new Date(issue.createdAt).toLocaleDateString(), icon: Calendar },
    { label: 'Resolved Date', value: issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : '—', icon: CheckCircle },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      <Link to="/governance/compliance-issues" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Issues
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 bg-gradient-to-r from-emerald-50 to-teal-50/30 p-6 rounded-2xl border border-emerald-100/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm shadow-emerald-100 mt-1"><AlertTriangle className="h-7 w-7 text-emerald-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{issue.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status={issue.status} />
              <SeverityBadge severity={issue.severity} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {issue.status === 'OPEN' && (
            <button onClick={() => handleStatusChange('IN_PROGRESS')} disabled={actionLoading} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-emerald-200/50 disabled:opacity-50 hover:-translate-y-0.5">
              Start Work
            </button>
          )}
          {['OPEN', 'IN_PROGRESS'].includes(issue.status) && !showResolveForm && (
            <button onClick={() => setShowResolveForm(true)} className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-teal-200/50 hover:-translate-y-0.5">
              <CheckCircle className="h-4 w-4" /> Resolve Issue
            </button>
          )}
          {issue.status === 'RESOLVED' && (
            <button onClick={() => handleStatusChange('CLOSED')} disabled={actionLoading} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm disabled:opacity-50">
              Close Issue
            </button>
          )}
        </div>
      </div>

      {/* Resolve Form */}
      {showResolveForm && (
        <form onSubmit={handleResolve} className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-6 space-y-5 shadow-sm shadow-teal-100/30">
          <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-600" /> Resolve this Issue
          </h3>
          
          <div>
            <label className="block text-sm font-semibold text-teal-900 mb-1">Resolution Notes *</label>
            <textarea
              required
              rows={4}
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              className="w-full rounded-xl border border-teal-200 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
              placeholder="Detail how this issue was resolved..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={actionLoading} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-teal-200/50 disabled:opacity-50">Submit Resolution</button>
            <button type="button" onClick={() => setShowResolveForm(false)} className="bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all">Cancel</button>
          </div>
        </form>
      )}

      {/* Info Grid */}
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

      {/* Description */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
        <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-emerald-500" /> Issue Description</h2>
        <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{issue.description}</p>
      </div>

      {/* Resolution Notes */}
      {issue.resolutionNotes && (
        <div className="bg-emerald-50/50 rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-100 p-6">
          <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-600" /> Resolution Notes</h2>
          <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{issue.resolutionNotes}</p>
        </div>
      )}

      {/* Linked Audit */}
      {issue.auditId && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4"><AlertTriangle className="h-5 w-5 text-emerald-500" /> Linked to Audit</h2>
          <Link to={`/governance/audits/${issue.auditId}`} className="inline-flex items-center justify-between w-full max-w-sm p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group shadow-sm shadow-emerald-100/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-emerald-50 shadow-sm shadow-emerald-100/30 group-hover:scale-105 transition-transform"><AlertTriangle className="h-4 w-4 text-emerald-500" /></div>
              <div>
                <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">View Source Audit</p>
                <p className="text-xs text-slate-500 font-medium font-mono mt-0.5">{issue.auditId.slice(0,8)}...</p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
