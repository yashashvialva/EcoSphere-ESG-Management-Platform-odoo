import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socialApi } from '../services/socialApi';
import ParticipationList from '../components/ParticipationList';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, MapPin, Users, Award, ArrowLeft } from 'lucide-react';

export default function CsrActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activity, setActivity] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [proofUrl, setProofUrl] = useState('');

  // Custom Modal State
  const [modal, setModal] = useState({ show: false, type: 'confirm', message: '', onConfirm: null });

  const showConfirm = (message, onConfirm) => {
    setModal({ show: true, type: 'confirm', message, onConfirm });
  };

  const showAlert = (message) => {
    setModal({ show: true, type: 'alert', message, onConfirm: null });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [activityData, participationData] = await Promise.all([
        socialApi.getCsrActivity(id),
        socialApi.getParticipationsByActivity(id)
      ]);
      setActivity(activityData);
      setParticipations(participationData);
    } catch (error) {
      console.error('Failed to load CSR activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = () => {
    showConfirm(`Are you sure you want to join the activity "${activity.title}"?`, async () => {
      setJoining(true);
      try {
        await socialApi.joinCsrActivity(id, proofUrl || undefined);
        showAlert('Successfully joined the CSR activity! Pending approval.');
        loadData();
      } catch (error) {
        showAlert(error.response?.data?.message || 'Error joining activity');
      } finally {
        setJoining(false);
      }
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading activity...</div>;
  if (!activity) return <div className="p-8 text-center text-red-500">Activity not found</div>;

  const hasJoined = participations.some(p => p.employeeId === user?.id);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Activities
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              activity.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {activity.status}
            </span>
          </div>

          <p className="text-gray-700 text-lg mb-8 leading-relaxed whitespace-pre-wrap">{activity.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-100 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Date</p>
              <p className="font-semibold text-gray-900">{new Date(activity.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center"><Award className="w-4 h-4 mr-2"/> Category</p>
              <p className="font-semibold text-gray-900">{activity.category?.name || 'General'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center"><Users className="w-4 h-4 mr-2"/> Participants</p>
              <p className="font-semibold text-gray-900">{activity._count?.participations || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center"><Award className="w-4 h-4 mr-2"/> Reward</p>
              <p className="font-semibold text-amber-600">{activity.maxPoints} XP</p>
            </div>
          </div>

          {!hasJoined && activity.status === 'PUBLISHED' && (
            <div className="bg-primary-50 rounded-lg p-6 border border-primary-100 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold text-primary-900">Want to participate?</h3>
                <p className="text-primary-700 text-sm">Join this activity to earn XP and make a difference.</p>
              </div>
              <div className="flex flex-col space-y-2 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Proof URL (e.g. photo link) - Optional"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="px-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button 
                  onClick={handleJoinClick}
                  disabled={joining}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
                >
                  {joining ? 'Joining...' : 'Join Activity'}
                </button>
              </div>
            </div>
          )}

          {hasJoined && (
            <div className="bg-green-50 text-green-800 rounded-lg p-4 border border-green-200 font-medium text-center">
              You are participating in this activity.
            </div>
          )}
        </div>
      </div>

      {/* Admin/Organizer Participation List View */}
      <ParticipationList activityId={id} initialParticipations={participations} />

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
                className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
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
