import { useState } from 'react';
import { socialApi } from '../services/socialApi';
import { ShieldCheck, XCircle } from 'lucide-react';

export default function ParticipationList({ activityId, initialParticipations = [], isAdmin = false }) {
  const [participations, setParticipations] = useState(initialParticipations);
  const [loadingId, setLoadingId] = useState(null);

  // Custom Modal State
  const [modal, setModal] = useState({ show: false, type: 'confirm', message: '', onConfirm: null });

  const showConfirm = (message, onConfirm) => {
    setModal({ show: true, type: 'confirm', message, onConfirm });
  };

  const showAlert = (message) => {
    setModal({ show: true, type: 'alert', message, onConfirm: null });
  };

  const handleEvaluateClick = (id, status, name) => {
    const actionText = status === 'APPROVED' ? 'approve' : 'reject';
    showConfirm(`Are you sure you want to ${actionText} participation for ${name}?`, async () => {
      setLoadingId(id);
      try {
        await socialApi.evaluateParticipation(id, status);
        // Update local state to reflect the evaluation
        setParticipations(prev => 
          prev.map(p => p.id === id ? { ...p, approvalStatus: status } : p)
        );
        showAlert(`Participation successfully ${status.toLowerCase()}!`);
      } catch (error) {
        showAlert(error.response?.data?.message || 'Error evaluating participation');
      } finally {
        setLoadingId(null);
      }
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  return (
    <div className="table-card">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Participants ({participations.length})</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {participations.map(p => (
          <div key={p.id} className="p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <p className="text-sm font-semibold text-gray-900">{p.employee?.firstName} {p.employee?.lastName}</p>
                {getStatusBadge(p.approvalStatus)}
              </div>
              {p.proofFile && (
                <a href={p.proofFile} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:underline">
                  View Evidence
                </a>
              )}
            </div>

            {p.approvalStatus === 'PENDING' && isAdmin && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEvaluateClick(p.id, 'APPROVED', `${p.employee?.firstName} ${p.employee?.lastName}`)}
                  disabled={loadingId === p.id}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 mr-1" /> Approve
                </button>
                <button
                  onClick={() => handleEvaluateClick(p.id, 'REJECTED', `${p.employee?.firstName} ${p.employee?.lastName}`)}
                  disabled={loadingId === p.id}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {participations.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">
            No one has joined this activity yet.
          </div>
        )}
      </div>

      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {modal.type === 'confirm' ? 'Confirm Action' : 'Notification'}
            </h3>
            <p className="text-gray-600 text-sm mb-6">{modal.message}</p>
            <div className="flex justify-end space-x-3">
              {modal.type === 'confirm' && (
                <button 
                  onClick={() => setModal({ ...modal, show: false })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={() => {
                  setModal({ ...modal, show: false });
                  if (modal.onConfirm) modal.onConfirm();
                }}
                className="btn-primary"
              >
                {modal.type === 'confirm' ? 'Confirm' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
