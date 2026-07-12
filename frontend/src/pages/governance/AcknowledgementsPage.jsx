import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { getMyAcknowledgements, acknowledgePolicy as ackApi } from '../../services/governanceApi';

const TAB_STYLES = {
  active: 'border-b-2 border-primary-600 text-primary-700 font-medium',
  inactive: 'text-gray-500 hover:text-gray-700',
};

export default function AcknowledgementsPage() {
  const [acks, setAcks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('pending');
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getMyAcknowledgements();
      setAcks(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load acknowledgements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAcknowledge = async (id) => {
    try {
      setActionId(id);
      await ackApi(id);
      await load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Acknowledge failed');
    } finally {
      setActionId(null);
    }
  };

  const pending = acks.filter((a) => a.status === 'PENDING' || a.status === 'OVERDUE');
  const completed = acks.filter((a) => a.status === 'ACKNOWLEDGED');
  const displayed = tab === 'pending' ? pending : completed;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CheckCircle className="h-7 w-7 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Policy Acknowledgements</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and acknowledge assigned policies</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        <button onClick={() => setTab('pending')} className={`pb-3 text-sm transition-colors ${tab === 'pending' ? TAB_STYLES.active : TAB_STYLES.inactive}`}>
          Pending ({pending.length})
        </button>
        <button onClick={() => setTab('completed')} className={`pb-3 text-sm transition-colors ${tab === 'completed' ? TAB_STYLES.active : TAB_STYLES.inactive}`}>
          Completed ({completed.length})
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error} — <button onClick={load} className="underline font-medium">Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {tab === 'pending' ? (
            <>
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm mt-1">No pending acknowledgements.</p>
            </>
          ) : (
            <>
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No completed acknowledgements yet</p>
            </>
          )}
        </div>
      ) : tab === 'pending' ? (
        /* Pending Cards */
        <div className="space-y-4">
          {displayed.map((ack) => {
            const isOverdue = ack.status === 'OVERDUE' || (ack.policy?.acknowledgementDueDate && new Date(ack.policy.acknowledgementDueDate) < new Date());
            return (
              <div key={ack.id} className={`bg-white rounded-xl shadow-sm border p-5 transition-shadow hover:shadow-md ${isOverdue ? 'border-red-200' : 'border-gray-100'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{ack.policy?.title || 'Untitled Policy'}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 ml-6">
                      <span className="font-mono">{ack.policy?.policyCode}</span>
                      <span>v{ack.policy?.version || ack.policyVersion}</span>
                      {ack.policy?.acknowledgementDueDate && (
                        <span className={`inline-flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                          {isOverdue ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          Due: {new Date(ack.policy.acknowledgementDueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {isOverdue && <p className="text-xs text-red-500 mt-1.5 ml-6 font-medium">⚠ This acknowledgement is overdue</p>}
                  </div>
                  <button
                    onClick={() => handleAcknowledge(ack.id)}
                    disabled={actionId === ack.id}
                    className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
                  >
                    {actionId === ack.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    {actionId === ack.id ? 'Acknowledging...' : 'Acknowledge'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Completed List */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {displayed.map((ack) => (
              <li key={ack.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ack.policy?.title || 'Untitled Policy'}</p>
                    <p className="text-xs text-gray-500">{ack.policy?.policyCode} · v{ack.policy?.version || ack.policyVersion}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {ack.acknowledgedAt ? new Date(ack.acknowledgedAt).toLocaleDateString() : '—'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
