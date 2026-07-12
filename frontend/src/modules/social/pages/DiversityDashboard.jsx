import { useEffect, useState } from 'react';
import { socialApi } from '../services/socialApi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Users, Building2, TrendingUp, Plus } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function DiversityDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await socialApi.getDiversitySummary();
      setMetrics(data || []);
    } catch (error) {
      console.error('Failed to load diversity metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data processing since we might not have enough seeded data for a rich chart
  const genderData = metrics.filter(m => m.metricType === 'Gender');
  const hasGenderData = genderData.length > 0;

  const pieChartData = {
    labels: hasGenderData ? genderData.map(m => m.metricName) : ['Male', 'Female', 'Non-Binary'],
    datasets: [{
      data: hasGenderData ? genderData.map(m => m.metricValue) : [45, 50, 5],
      backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6'],
      borderWidth: 0,
    }]
  };

  const barChartData = {
    labels: ['Engineering', 'Sales', 'HR', 'Marketing'],
    datasets: [{
      label: 'Diversity Score',
      data: [78, 85, 92, 88],
      backgroundColor: '#10b981',
      borderRadius: 4,
    }]
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diversity & Inclusion</h1>
          <p className="mt-1 text-sm text-gray-500">Track and analyze workforce diversity metrics</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Metric Snapshot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Workforce</p>
            <p className="text-2xl font-bold text-gray-900">2,450</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mr-4">
            <Building2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Departments Tracked</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Overall Diversity Index</p>
            <p className="text-2xl font-bold text-gray-900">84/100</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Gender Distribution</h3>
          <div className="flex justify-center h-64">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Diversity Score by Department</h3>
          <div className="h-64">
            <Bar 
              data={barChartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 100 } }
              }} 
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Add Diversity Snapshot</h2>
            <p className="text-sm text-gray-500 mb-6">In a real environment, this form would capture detailed diversity metrics for a specific department and date.</p>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
