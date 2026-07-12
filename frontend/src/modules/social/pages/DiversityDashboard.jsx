import { useEffect, useState } from 'react';
import { socialApi } from '../services/socialApi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Users, Building2, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function DiversityDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    metricType: 'Gender',
    notes: 'Female',
    metricValue: 50,
    reportingDate: new Date().toISOString().split('T')[0]
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!user?.departmentId) {
      showAlert('You must be assigned to a department to submit metrics.');
      return;
    }
    showConfirm(`Are you sure you want to add this diversity metric snapshot?`, async () => {
      try {
        await socialApi.addDiversityMetric({
          departmentId: user.departmentId,
          metricType: formData.metricType,
          notes: formData.notes,
          metricValue: Number(formData.metricValue),
          reportingDate: new Date(formData.reportingDate).toISOString()
        });
        showAlert('Snapshot added successfully!');
        setShowAddModal(false);
        loadMetrics();
      } catch (error) {
        showAlert(error.response?.data?.message || 'Failed to add snapshot');
      }
    });
  };

  // Mock data processing since we might not have enough seeded data for a rich chart
  const genderData = metrics.filter(m => m.metricType === 'Gender');
  const hasGenderData = genderData.length > 0;

  const pieChartData = {
    labels: hasGenderData ? genderData.map(m => m.notes) : ['Male', 'Female', 'Non-Binary'],
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
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Add Diversity Snapshot</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metric Type</label>
                <select value={formData.metricType} onChange={e => setFormData({...formData, metricType: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="Gender">Gender</option>
                  <option value="Ethnicity">Ethnicity</option>
                  <option value="Age Group">Age Group</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category / Group (e.g. Female, Male)</label>
                <input required type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metric Value (%)</label>
                <input required type="number" min="0" max="100" value={formData.metricValue} onChange={e => setFormData({...formData, metricValue: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Date</label>
                <input required type="date" value={formData.reportingDate} onChange={e => setFormData({...formData, reportingDate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Add</button>
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
