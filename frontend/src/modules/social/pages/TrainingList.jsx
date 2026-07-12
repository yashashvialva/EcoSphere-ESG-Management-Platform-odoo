import { useEffect, useState } from 'react';
import { socialApi } from '../services/socialApi';
import { BookOpen, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  const handleComplete = async (trainingId) => {
    try {
      await socialApi.completeTraining(trainingId, 100); // hardcode score 100 for UI demo
      alert('Training completed successfully! XP Awarded.');
      loadTrainings(); // reload to reflect changes
    } catch (error) {
      alert(error.response?.data?.message || 'Error completing training');
    }
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
          <div key={training.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
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

              <button 
                onClick={() => handleComplete(training.id)}
                className="w-full flex justify-center items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </button>
            </div>
          </div>
        ))}

        {trainings.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
            No training modules available right now.
          </div>
        )}
      </div>
    </div>
  );
}
