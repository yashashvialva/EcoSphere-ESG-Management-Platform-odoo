import { useEffect, useState } from 'react';
import { socialApi } from '../services/socialApi';
import { BookOpen, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '../../../store/authStore';

export default function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Custom Modal State
  const [modal, setModal] = useState({ show: false, type: 'confirm', message: '', onConfirm: null });

  const showConfirm = (message, onConfirm) => {
    setModal({ show: true, type: 'confirm', message, onConfirm });
  };

  const showAlert = (message) => {
    setModal({ show: true, type: 'alert', message, onConfirm: null });
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const data = await socialApi.getTrainings();
      setTrainings(data);
    } catch (error) {
      console.error('Failed to load trainings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteClick = (trainingId, title) => {
    showConfirm(`Are you sure you want to mark "${title}" as completed?`, async () => {
      try {
        await socialApi.completeTraining(trainingId, 100); // hardcode score 100 for UI demo
        showAlert('Training completed successfully! XP Awarded.');
        loadTrainings(); // reload to reflect changes
      } catch (error) {
        showAlert(error.response?.data?.message || 'Error completing training');
      }
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading trainings...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Modules</h1>
          <p className="mt-1 text-sm text-gray-500">Complete trainings to earn XP and Badges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map(training => (
          <div key={training.id} className="card !p-0 overflow-hidden hover:-translate-y-1">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{training.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{training.description}</p>
              
              <div className="flex items-center text-sm font-medium text-amber-600 mb-6 bg-amber-50 inline-flex px-2.5 py-1 rounded-full">
                <Award className="w-4 h-4 mr-1" />
                {training.pointsAwarded} XP
              </div>

              {training.isCompleted ? (
                <div className="w-full flex justify-center items-center px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg font-semibold text-sm cursor-default">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </div>
              ) : (
                <button 
                  onClick={() => handleCompleteClick(training.id, training.title)}
                  className="btn-primary"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}

        {trainings.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
            No training modules available right now.
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
