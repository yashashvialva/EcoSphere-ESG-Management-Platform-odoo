import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { socialApi } from '../services/socialApi';
import { useAuth } from '../../../store/authStore';
import { Leaf, Plus, Calendar, Users } from 'lucide-react';

export default function CsrActivityList() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator';
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    maxPoints: 0
  });

  // Custom Modal State
  const [modal, setModal] = useState({ show: false, type: 'confirm', message: '', onConfirm: null });

  const showConfirm = (message, onConfirm) => {
    setModal({ show: true, type: 'confirm', message, onConfirm });
  };

  const showAlert = (message) => {
    setModal({ show: true, type: 'alert', message, onConfirm: null });
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await socialApi.getCsrActivities();
      setActivities(response.data || []);
    } catch (error) {
      console.error('Failed to load CSR activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    showConfirm(`Are you sure you want to create the CSR activity "${formData.title}"?`, async () => {
      try {
        await socialApi.createCsrActivity({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          maxPoints: Number(formData.maxPoints)
        });
        setShowCreateModal(false);
        loadActivities();
        showAlert('Activity created successfully!');
      } catch (error) {
        showAlert(error.response?.data?.message || 'Failed to create activity');
      }
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading CSR activities...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CSR Activities</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and participate in corporate social responsibility events</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add CSR Activity
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(activity => (
          <Link key={activity.id} to={`/social/csr-activities/${activity.id}`} className="card !p-0 overflow-hidden hover:-translate-y-1">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activity.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 
                  activity.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(activity.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {activity._count?.participations || 0} Participants
                </div>
              </div>
            </div>
          </Link>
        ))}

        {activities.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
            No CSR activities found. Create one to get started!
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create CSR Activity</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max XP Reward</label>
                <input required type="number" min="0" value={formData.maxPoints} onChange={e => setFormData({...formData, maxPoints: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
