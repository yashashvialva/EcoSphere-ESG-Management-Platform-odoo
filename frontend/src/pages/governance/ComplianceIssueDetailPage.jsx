import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, User, Calendar, Building, PlayCircle, CheckCircle, ClipboardCheck, MessageSquare } from 'lucide-react';
import { getComplianceIssueById, updateComplianceIssueStatus, resolveComplianceIssue } from '../../services/governanceApi';

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

export default function ComplianceIssueDetailPage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Resolve Form State
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
    if (!window.confirm(`Are you sure you want to mark this issue as ${newStatus}?`)) return;
    try {
      setActionLoading(true);
      await updateComplianceIssueStatus(id, newStatus);
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
      await resolveComplianceIssue(id, resolutionNotes);
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
        <Link to="/governance/compliance-issues" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={load} className="mt-3 text-sm text-red-600 underline">Retry</button>
        </div>
      </div>
    );
  }

  const info = [
    { label: 'Department', value: issue.department || '—', icon: Building },
    { label: 'Owner', value: issue.ownerEmployee ? `${issue.ownerEmployee.firstName} ${issue.ownerEmployee.lastName}` : '—', icon: User },
    { label: 'Created By', value: issue.reporterEmployee ? `${issue.reporterEmployee.firstName} ${issue.reporterEmployee.lastName}` : '—', icon: User },
    { label: 'Due Date', value: issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '—', icon: Calendar },
    { label: 'Created', value: new Date(issue.createdAt).toLocaleDateString(), icon: Calendar },
    { label: 'Last Updated', value: new Date(issue.updatedAt).toLocaleDateString(), icon: Calendar },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link to="/governance/compliance-issues" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Compliance Issues
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-50 rounded-lg mt-0.5"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[issue.status]}`}>{issue.status?.replace('_', ' ')}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[issue.severity]}`}>{issue.severity}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {issue.status === 'OPEN' && (
            <button onClick={() => handleStatusChange('IN_PROGRESS')} disabled={actionLoading} className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
              <PlayCircle className="h-4 w-4" /> Start Work
            </button>
          )}
          {['OPEN', 'IN_PROGRESS'].includes(issue.status) && !showResolveForm && (
            <button onClick={() => setShowResolveForm(true)} className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              <CheckCircle className="h-4 w-4" /> Resolve
            </button>
          )}
          {issue.status === 'RESOLVED' && (
            <button onClick={() => handleStatusChange('CLOSED')} disabled={actionLoading} className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
              <CheckCircle className="h-4 w-4" /> Close Issue
            </button>
          )}
        </div>
      </div>

      {/* Resolve Issue Form */}
      {showResolveForm && (
        <form onSubmit={handleResolve} className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Resolve Compliance Issue
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-emerald-900 mb-1">Resolution Notes</label>
            <textarea
              required
              minLength={10}
              rows={3}
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              className="w-full rounded-lg border border-emerald-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="Detail how this issue was resolved (min 10 characters)..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">Submit Resolution</button>
            <button type="button" onClick={() => setShowResolveForm(false)} className="border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-lg px-4 py-2 text-sm font-medium transition-colors">Cancel</button>
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

          {issue.audit && (
            <div className="flex items-start gap-3">
              <ClipboardCheck className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Related Audit</p>
                <Link to={`/governance/audits/${issue.audit.id}`} className="text-sm text-primary-600 hover:text-primary-700 hover:underline mt-0.5 block truncate max-w-[200px]">
                  {issue.audit.title || issue.audit.id}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {issue.description && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-400" /> Issue Description
          </h2>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{issue.description}</div>
        </div>
      )}

      {/* Resolution Details */}
      {issue.resolutionNotes && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-base font-semibold text-emerald-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" /> Resolution Details
            </h2>
            {issue.resolvedAt && (
              <span className="text-sm text-emerald-700 font-medium">
                Resolved: {new Date(issue.resolvedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="prose prose-sm max-w-none text-emerald-800 whitespace-pre-wrap">{issue.resolutionNotes}</div>
        </div>
      )}

    </div>
  );
}
