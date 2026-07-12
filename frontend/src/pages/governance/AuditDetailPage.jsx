import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck, User, Calendar, Hash, Building, PlayCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { getAuditById, updateAuditStatus } from '../../services/governanceApi';

const STATUS_COLORS = {
  PLANNED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const TYPE_COLORS = {
  INTERNAL: 'bg-purple-100 text-purple-700',
  EXTERNAL: 'bg-blue-100 text-blue-700',
  COMPLIANCE: 'bg-indigo-100 text-indigo-700',
  ESG: 'bg-emerald-100 text-emerald-700',
};

const SEVERITY_COLORS = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

export default function AuditDetailPage() {
  const { id } = useParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Complete Audit Form State
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
      setAudit(res.data.data);
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
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-80 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Link to="/governance/audits" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={load} className="mt-3 text-sm text-red-600 underline">Retry</button>
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
    { label: 'Status', value: audit.status, icon: ClipboardCheck },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link to="/governance/audits" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Audits
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-50 rounded-lg mt-0.5"><ClipboardCheck className="h-6 w-6 text-primary-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{audit.title}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[audit.status]}`}>{audit.status?.replace('_', ' ')}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[audit.auditType]}`}>{audit.auditType?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {audit.status === 'PLANNED' && (
            <button onClick={handleStart} disabled={actionLoading} className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
              <PlayCircle className="h-4 w-4" /> Start Audit
            </button>
          )}
          {audit.status === 'IN_PROGRESS' && !showCompleteForm && (
            <button onClick={() => setShowCompleteForm(true)} className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              <CheckCircle className="h-4 w-4" /> Complete Audit
            </button>
          )}
        </div>
      </div>

      {/* Complete Audit Form */}
      {showCompleteForm && (
        <form onSubmit={handleComplete} className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-green-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Complete this Audit
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-green-900 mb-1">Overall Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              required
              value={completeData.overallRating}
              onChange={e => setCompleteData({...completeData, overallRating: e.target.value})}
              className="w-full sm:w-32 rounded-lg border border-green-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-900 mb-1">Findings Summary</label>
            <textarea
              required
              rows={3}
              value={completeData.findingsSummary}
              onChange={e => setCompleteData({...completeData, findingsSummary: e.target.value})}
              className="w-full rounded-lg border border-green-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Summarize the findings of this audit..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={actionLoading} className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">Save & Complete</button>
            <button type="button" onClick={() => setShowCompleteForm(false)} className="border border-green-300 text-green-800 hover:bg-green-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors">Cancel</button>
          </div>
        </form>
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

      {/* Findings Summary */}
      {audit.findingsSummary && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Findings Summary</h2>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{audit.findingsSummary}</div>
        </div>
      )}

      {/* Compliance Issues */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Related Compliance Issues</h2>
        </div>
        
        {!audit.complianceIssues || audit.complianceIssues.length === 0 ? (
          <p className="text-sm text-gray-500">No compliance issues associated with this audit.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {audit.complianceIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[200px] truncate">{issue.title}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[issue.severity] || ''}`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/governance/compliance-issues/${issue.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">View →</Link>
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
