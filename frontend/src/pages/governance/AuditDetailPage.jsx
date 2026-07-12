import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck, User, Calendar, Hash, Building, PlayCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { getAuditById, updateAuditStatus } from '../../services/governanceApi';
import { StatusBadge, TypeBadge, SeverityBadge } from './components/GovernanceBadges';

export default function AuditDetailPage() {
  const { id } = useParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [completeData, setCompleteData] = useState({
    overallRating: 3,
    findingsSummary: '',
  });

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getAuditById(id);
      setAudit(res.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load audit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = async () => {
    if (!window.confirm('Are you sure you want to start this audit?')) return;
    try {
      setActionLoading(true);
      await updateAuditStatus(id, { status: 'IN_PROGRESS' });
      await load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to start audit');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await updateAuditStatus(id, {
        status: 'COMPLETED',
        overallRating: Number(completeData.overallRating),
        findingsSummary: completeData.findingsSummary,
        completedDate: new Date().toISOString(),
      });
      setShowCompleteForm(false);
      await load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to complete audit');
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
        <Link to="/governance/audits" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-700 font-semibold">{error}</p>
          <button onClick={load} className="mt-4 text-sm bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-6 py-2 font-semibold transition-all">Retry</button>
        </div>
      </div>
    );
  }

  const info = [
    { label: 'Department', value: audit.department || '—', icon: Building },
    { label: 'Auditor', value: audit.auditorEmployee ? `${audit.auditorEmployee.firstName} ${audit.auditorEmployee.lastName}` : '—', icon: User },
    { label: 'Scheduled Date', value: audit.scheduledDate ? new Date(audit.scheduledDate).toLocaleDateString() : '—', icon: Calendar },
    { label: 'Completed Date', value: audit.completedDate ? new Date(audit.completedDate).toLocaleDateString() : '—', icon: Calendar },
    { label: 'Overall Rating', value: audit.overallRating ? `${audit.overallRating} / 5` : '—', icon: Hash },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      <Link to="/governance/audits" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Audits
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 bg-gradient-to-r from-emerald-50 to-teal-50/30 p-6 rounded-2xl border border-emerald-100/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm shadow-emerald-100 mt-1"><ClipboardCheck className="h-7 w-7 text-emerald-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{audit.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status={audit.status} />
              <TypeBadge type={audit.auditType} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {audit.status === 'PLANNED' && (
            <button onClick={handleStart} disabled={actionLoading} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-emerald-200/50 disabled:opacity-50 hover:-translate-y-0.5">
              <PlayCircle className="h-4 w-4" /> Start Audit
            </button>
          )}
          {audit.status === 'IN_PROGRESS' && !showCompleteForm && (
            <button onClick={() => setShowCompleteForm(true)} className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-teal-200/50 hover:-translate-y-0.5">
              <CheckCircle className="h-4 w-4" /> Complete Audit
            </button>
          )}
        </div>
      </div>

      {/* Complete Form */}
      {showCompleteForm && (
        <form onSubmit={handleComplete} className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-6 space-y-5 shadow-sm shadow-teal-100/30">
          <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-600" /> Complete this Audit
          </h3>
          
          <div>
            <label className="block text-sm font-semibold text-teal-900 mb-1">Overall Rating (1-5) *</label>
            <input
              type="number"
              min="1"
              max="5"
              required
              value={completeData.overallRating}
              onChange={e => setCompleteData({...completeData, overallRating: e.target.value})}
              className="w-full sm:w-32 rounded-xl border border-teal-200 bg-white/80 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-teal-900 mb-1">Findings Summary *</label>
            <textarea
              required
              rows={4}
              value={completeData.findingsSummary}
              onChange={e => setCompleteData({...completeData, findingsSummary: e.target.value})}
              className="w-full rounded-xl border border-teal-200 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
              placeholder="Summarize the findings of this audit..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={actionLoading} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-all shadow-sm shadow-teal-200/50 disabled:opacity-50">Save & Complete</button>
            <button type="button" onClick={() => setShowCompleteForm(false)} className="bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all">Cancel</button>
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

      {/* Findings Summary */}
      {audit.findingsSummary && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 p-6">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-emerald-500" /> Findings Summary</h2>
          <div className="prose prose-sm max-w-none prose-emerald prose-p:font-medium prose-p:text-slate-600 whitespace-pre-wrap p-5 bg-slate-50/50 rounded-xl border border-slate-100">{audit.findingsSummary}</div>
        </div>
      )}

      {/* Compliance Issues */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 overflow-hidden p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-emerald-500" /> Related Compliance Issues</h2>
        </div>
        
        {!audit.complianceIssues || audit.complianceIssues.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-emerald-200">
             <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-30 text-emerald-500" />
            <p className="text-sm font-semibold text-slate-500">No compliance issues associated with this audit.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-50">
              <thead className="bg-emerald-50/30">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {audit.complianceIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-slate-800 max-w-[200px] truncate">{issue.title}</td>
                    <td className="px-4 py-4"><SeverityBadge severity={issue.severity} /></td>
                    <td className="px-4 py-4"><StatusBadge status={issue.status} /></td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">{issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-4 text-right">
                      <Link to={`/governance/compliance-issues/${issue.id}`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
