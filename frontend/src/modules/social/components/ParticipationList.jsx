import { useState } from 'react';
import { socialApi } from '../services/socialApi';
import { ShieldCheck, XCircle } from 'lucide-react';

export default function ParticipationList({ activityId, initialParticipations = [] }) {
  const [participations, setParticipations] = useState(initialParticipations);
  const [loadingId, setLoadingId] = useState(null);

  const handleEvaluate = async (id, status) => {
    setLoadingId(id);
    try {
      await socialApi.evaluateParticipation(id, status);
      // Update local state to reflect the evaluation
      setParticipations(prev => 
        prev.map(p => p.id === id ? { ...p, approvalStatus: status } : p)
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Error evaluating participation');
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              {p.proofUrl && (
                <a href={p.proofUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:underline">
                  View Evidence
                </a>
              )}
            </div>

            {p.approvalStatus === 'Pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEvaluate(p.id, 'Approved')}
                  disabled={loadingId === p.id}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 mr-1" /> Approve
                </button>
                <button
                  onClick={() => handleEvaluate(p.id, 'Rejected')}
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
    </div>
  );
}
