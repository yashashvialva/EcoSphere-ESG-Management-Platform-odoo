import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Target, TrendingUp } from 'lucide-react';
import environmentalApi from '../services/environmentalApi';
import EsgGoalForm from '../components/EsgGoalForm';
import { useAuth } from '../../../store/authStore';
import { format } from 'date-fns';

const EsgGoalsPage = () => {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('environmental.manage');
  
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [page]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await environmentalApi.getEsgGoals({
        page,
        limit: 10,
      });
      setGoals(res.data);
      setTotalPages(res.meta.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load ESG goals');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (goal = null) => {
    setCurrentGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentGoal(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (currentGoal) {
        await environmentalApi.updateEsgGoal(currentGoal.id, data);
      } else {
        await environmentalApi.createEsgGoal(data);
      }
      fetchGoals();
      handleCloseModal();
    } catch (err) {
      alert(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await environmentalApi.deleteEsgGoal(id);
        fetchGoals();
      } catch (err) {
        alert(err.message || 'Failed to delete goal.');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ON_TRACK': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">On Track</span>;
      case 'AT_RISK': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">At Risk</span>;
      case 'ACHIEVED': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Achieved</span>;
      case 'MISSED': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Missed</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ESG Goals</h1>
          <p className="text-sm text-gray-500 mt-1">Set and track targets for environmental sustainability.</p>
        </div>
        {canManage && (
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Set New Goal
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-start mb-6">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No ESG goals have been set yet.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progressPercentage = Math.min(100, Math.max(0, (goal.current_value / goal.target_value) * 100));
            
            return (
              <div key={goal.id} className="card hover:shadow-md transition-shadow relative">
                {canManage && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={() => handleOpenModal(goal)} className="text-gray-400 hover:text-primary-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(goal.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center mb-4 pr-16">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-4">
                    <Target className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1" title={goal.description || 'Target'}>
                      {goal.department?.name || 'Organization'} Target
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      Deadline: {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2">{goal.description}</p>
                )}

                <div className="mb-2 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Progress</p>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-gray-900">{Number(goal.current_value).toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-1">/ {Number(goal.target_value).toLocaleString()} {goal.unit}</span>
                    </div>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${progressPercentage >= 100 ? 'bg-green-500' : 'bg-primary-500'}`} 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                    <TrendingUp className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {currentGoal ? 'Update Goal Progress' : 'Set New ESG Goal'}
                  </h3>
                </div>
                <EsgGoalForm 
                  initialData={currentGoal} 
                  onSubmit={handleSubmit} 
                  onCancel={handleCloseModal}
                  isLoading={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EsgGoalsPage;
