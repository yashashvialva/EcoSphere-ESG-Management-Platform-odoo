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
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchGoals(); }, [page]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await environmentalApi.getEsgGoals({ page, limit: 10 });
      setGoals(res.data);
      setTotalPages(res.meta.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load ESG goals');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (goal = null) => { setCurrentGoal(goal); setIsModalOpen(true); };
  const handleCloseModal = () => { setCurrentGoal(null); setIsModalOpen(false); };

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
      case 'ON_TRACK': return <span className="chip-success">On Track</span>;
      case 'AT_RISK': return <span className="chip-warning">At Risk</span>;
      case 'ACHIEVED': return <span className="chip-info">Achieved</span>;
      case 'MISSED': return <span className="chip-error">Missed</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl" style={{ background: '#F5C75D22' }}>
            <Target className="h-6 w-6" style={{ color: '#c49800' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>ESG Goals</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Set and track targets for environmental sustainability.</p>
          </div>
        </div>
        {canManage && (
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Set New Goal
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl flex items-start border" style={{ background: '#E96A6A11', borderColor: '#E96A6A33' }}>
          <AlertCircle className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: '#E96A6A' }} />
          <p className="text-sm" style={{ color: '#E96A6A' }}>{error}</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-sm" style={{ color: '#6B7280' }}>Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="col-span-full py-12 text-center flex flex-col items-center bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#ECE8E3' }}>
            <Target className="w-12 h-12 mx-auto mb-3" style={{ color: '#ECE8E3' }} />
            <p className="text-sm" style={{ color: '#6B7280' }}>No ESG goals have been set yet.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progressPercentage = Math.min(100, Math.max(0, (goal.current_value / goal.target_value) * 100));
            
            return (
              <div key={goal.id} className="card relative transition-transform hover:-translate-y-1">
                {canManage && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={() => handleOpenModal(goal)} className="transition-colors" style={{ color: '#9BBDAF' }} onMouseEnter={e => e.currentTarget.style.color = '#5E9E6F'} onMouseLeave={e => e.currentTarget.style.color = '#9BBDAF'}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(goal.id)} className="transition-colors" style={{ color: '#E96A6A88' }} onMouseEnter={e => e.currentTarget.style.color = '#E96A6A'} onMouseLeave={e => e.currentTarget.style.color = '#E96A6A88'}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center mb-4 pr-16">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4" style={{ background: '#F5C75D22' }}>
                    <Target className="w-5 h-5" style={{ color: '#c49800' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold line-clamp-1" style={{ color: '#2F2F2F' }} title={goal.description || 'Target'}>
                      {goal.department?.name || 'Organization'} Target
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                      Deadline: {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-sm mb-6 line-clamp-2" style={{ color: '#6B7280' }}>{goal.description}</p>
                )}

                <div className="mb-2 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#836A78' }}>Progress</p>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold" style={{ color: '#2F2F2F' }}>{Number(goal.current_value).toLocaleString()}</span>
                      <span className="text-xs ml-1" style={{ color: '#6B7280' }}>/ {Number(goal.target_value).toLocaleString()} {goal.unit}</span>
                    </div>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>

                <div className="w-full rounded-full h-2 mt-3 overflow-hidden" style={{ background: '#ECE8E3' }}>
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%`, background: progressPercentage >= 100 ? '#5E9E6F' : '#9BBDAF' }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost py-1.5 px-4 text-sm disabled:opacity-40">
            Previous
          </button>
          <span className="text-sm" style={{ color: '#6B7280' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost py-1.5 px-4 text-sm disabled:opacity-40">
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseModal} />
            <div className="relative bg-white rounded-2xl shadow-lg max-w-lg w-full border" style={{ borderColor: '#ECE8E3' }}>
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center mb-4 space-x-3">
                  <div className="p-2 rounded-xl" style={{ background: '#F5C75D22' }}>
                    <TrendingUp className="h-5 w-5" style={{ color: '#c49800' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#2F2F2F' }}>
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
