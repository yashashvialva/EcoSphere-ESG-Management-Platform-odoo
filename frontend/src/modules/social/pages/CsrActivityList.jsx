import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { socialApi } from '../services/socialApi';
import { Leaf, Plus, Calendar, Users } from 'lucide-react';

export default function CsrActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading CSR activities...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CSR Activities</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and participate in corporate social responsibility events</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Activity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(activity => (
          <Link key={activity.id} to={`/social/csr-activities/${activity.id}`} className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activity.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
                {activity.maxParticipants && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {activity._count?.participations || 0} / {activity.maxParticipants}
                  </div>
                )}
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
    </div>
  );
}
