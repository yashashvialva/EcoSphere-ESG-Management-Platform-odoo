import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText, Loader2, Sparkles } from 'lucide-react';
import { getMyAcknowledgements, acknowledgePolicy as ackApi } from '../../services/governanceApi';

const TAB_STYLES = {
  active: 'border-b-2 border-emerald-500 text-emerald-700 font-bold',
  inactive: 'text-slate-500 font-medium hover:text-emerald-600',
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
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50/30 p-6 rounded-2xl border border-emerald-100/50">
        <div className="p-3 bg-white rounded-xl shadow-sm shadow-emerald-100"><CheckCircle className="h-7 w-7 text-emerald-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Policy Acknowledgements</h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">Review and acknowledge assigned policies</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-emerald-100 px-2">
        <button onClick={() => setTab('pending')} className={`pb-3 text-sm transition-colors ${tab === 'pending' ? TAB_STYLES.active : TAB_STYLES.inactive}`}>
          Pending <span className="ml-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">{pending.length}</span>
        </button>
        <button onClick={() => setTab('completed')} className={`pb-3 text-sm transition-colors ${tab === 'completed' ? TAB_STYLES.active : TAB_STYLES.inactive}`}>
          Completed <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{completed.length}</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm">
          {error} — <button onClick={load} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-emerald-50/50 rounded-2xl animate-pulse" />)}</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-24 text-slate-400 bg-white/50 rounded-2xl border border-dashed border-emerald-200">
          {tab === 'pending' ? (
            <>
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
              <p className="font-bold text-slate-600 text-lg">All caught up!</p>
              <p className="text-sm mt-1 font-medium">No pending acknowledgements at the moment.</p>
            </>
          ) : (
            <>
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-slate-400" />
              <p className="font-bold text-slate-600">No completed acknowledgements yet</p>
            </>
          )}
        </div>
      ) : tab === 'pending' ? (
        /* Pending Cards */
        <div className="space-y-4">
          {displayed.map((ack) => {
            const isOverdue = ack.status === 'OVERDUE' || (ack.policy?.acknowledgementDueDate && new Date(ack.policy.acknowledgementDueDate) < new Date());
            return (
              <div key={ack.id} className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 p-6 border ${isOverdue ? 'border-rose-200 shadow-rose-100/50' : 'border-emerald-100 shadow-emerald-100/50'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isOverdue ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                        <FileText className={`h-5 w-5 ${isOverdue ? 'text-rose-500' : 'text-emerald-500'}`} />
                      </div>
                      <h3 className="text-base font-bold text-slate-800 truncate">{ack.policy?.title || 'Untitled Policy'}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 ml-11">
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">{ack.policy?.policyCode}</span>
                      <span>v{ack.policy?.version || ack.policyVersion}</span>
                      {ack.policy?.acknowledgementDueDate && (
                        <span className={`inline-flex items-center gap-1.5 ${isOverdue ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md' : 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md'}`}>
                          {isOverdue ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                          Due: {new Date(ack.policy.acknowledgementDueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {isOverdue && <p className="text-xs text-rose-500 mt-2.5 ml-11 font-bold flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> This acknowledgement is overdue</p>}
                  </div>
                  <button
                    onClick={() => handleAcknowledge(ack.id)}
                    disabled={actionId === ack.id}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-3 text-sm font-bold transition-all shadow-sm shadow-emerald-200/50 disabled:opacity-50 shrink-0"
                  >
                    {actionId === ack.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                    {actionId === ack.id ? 'Acknowledging...' : 'Acknowledge Policy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Completed List */
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm shadow-emerald-100/50 border border-emerald-50 overflow-hidden">
          <ul className="divide-y divide-emerald-50">
            {displayed.map((ack) => (
              <li key={ack.id} className="px-6 py-5 flex items-center justify-between hover:bg-emerald-50/50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-emerald-50 rounded-lg shrink-0"><CheckCircle className="h-5 w-5 text-emerald-500" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{ack.policy?.title || 'Untitled Policy'}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{ack.policy?.policyCode} <span className="mx-1">•</span> v{ack.policy?.version || ack.policyVersion}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                  Ack: {ack.acknowledgedAt ? new Date(ack.acknowledgedAt).toLocaleDateString() : '—'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
