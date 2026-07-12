import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, Leaf } from 'lucide-react';
import environmentalApi from '../services/environmentalApi';
import EmissionFactorForm from '../components/EmissionFactorForm';
import { useAuth } from '../../../store/authStore';

const EmissionFactorsPage = () => {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('environmental.manage');
  
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFactor, setCurrentFactor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchFactors(); }, [page, searchTerm]);

  const fetchFactors = async () => {
    try {
      setLoading(true);
      const res = await environmentalApi.getEmissionFactors({ page, limit: 10, search: searchTerm });
      setFactors(res.data);
      setTotalPages(res.meta.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load emission factors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchFactors(); };
  const handleOpenModal = (factor = null) => { setCurrentFactor(factor); setIsModalOpen(true); };
  const handleCloseModal = () => { setCurrentFactor(null); setIsModalOpen(false); };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (currentFactor) {
        await environmentalApi.updateEmissionFactor(currentFactor.id, data);
      } else {
        await environmentalApi.createEmissionFactor(data);
      }
      fetchFactors();
      handleCloseModal();
    } catch (err) {
      alert(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this emission factor?')) {
      try {
        await environmentalApi.deleteEmissionFactor(id);
        fetchFactors();
      } catch (err) {
        alert(err.message || 'Failed to delete emission factor.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl" style={{ background: '#9BBDAF22' }}>
            <Leaf className="h-6 w-6" style={{ color: '#5E9E6F' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>Emission Factors</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Manage greenhouse gas emission factors and conversion rates.</p>
          </div>
        </div>
        {canManage && (
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Factor
          </button>
        )}
      </div>

      {/* Search */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-3 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#836A78' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
              placeholder="Search source or description..."
            />
          </div>
          <button type="submit" className="btn-secondary">Search</button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl flex items-start border" style={{ background: '#E96A6A11', borderColor: '#E96A6A33' }}>
          <AlertCircle className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: '#E96A6A' }} />
          <p className="text-sm" style={{ color: '#E96A6A' }}>{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#ECE8E3' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ background: '#F8C7AE22' }}>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Unit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Factor (kg CO2e)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Status</th>
                {canManage && <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#ECE8E3' }}>
              {loading ? (
                <tr><td colSpan={canManage ? 5 : 4} className="px-6 py-10 text-center text-sm" style={{ color: '#6B7280' }}>Loading...</td></tr>
              ) : factors.length === 0 ? (
                <tr><td colSpan={canManage ? 5 : 4} className="px-6 py-10 text-center text-sm" style={{ color: '#6B7280' }}>No emission factors found.</td></tr>
              ) : (
                factors.map((factor) => (
                  <tr
                    key={factor.id}
                    className="transition-colors duration-150"
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF8C9'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold" style={{ color: '#2F2F2F' }}>{factor.source}</div>
                      {factor.description && <div className="text-xs truncate max-w-xs" style={{ color: '#6B7280' }}>{factor.description}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>{factor.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono" style={{ color: '#2F2F2F' }}>{Number(factor.factor).toFixed(4)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={factor.is_active ? 'chip-success' : 'chip-gray'}>
                        {factor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                        <button onClick={() => handleOpenModal(factor)} className="transition-colors" style={{ color: '#9BBDAF' }} onMouseEnter={e => e.currentTarget.style.color = '#5E9E6F'} onMouseLeave={e => e.currentTarget.style.color = '#9BBDAF'}>
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button onClick={() => handleDelete(factor.id)} className="transition-colors" style={{ color: '#E96A6A88' }} onMouseEnter={e => e.currentTarget.style.color = '#E96A6A'} onMouseLeave={e => e.currentTarget.style.color = '#E96A6A88'}>
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t flex items-center justify-between" style={{ borderColor: '#ECE8E3' }}>
            <span className="text-sm" style={{ color: '#6B7280' }}>Page {page} of {totalPages}</span>
            <div className="flex space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost py-1.5 px-4 text-sm disabled:opacity-40">Previous</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost py-1.5 px-4 text-sm disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseModal} />
            <div className="relative bg-white rounded-2xl shadow-lg max-w-lg w-full border" style={{ borderColor: '#ECE8E3' }}>
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#2F2F2F' }}>
                  {currentFactor ? 'Edit Emission Factor' : 'Add Emission Factor'}
                </h3>
                <EmissionFactorForm 
                  initialData={currentFactor} 
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

export default EmissionFactorsPage;
