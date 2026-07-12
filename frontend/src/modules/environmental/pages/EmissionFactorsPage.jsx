import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react';
import environmentalApi from '../services/environmentalApi';
import EmissionFactorForm from '../components/EmissionFactorForm';
import { useAuth } from '../../../store/authStore';

const EmissionFactorsPage = () => {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('environmental.manage');
  
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFactor, setCurrentFactor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFactors();
  }, [page, searchTerm]);

  const fetchFactors = async () => {
    try {
      setLoading(true);
      const res = await environmentalApi.getEmissionFactors({
        page,
        limit: 10,
        search: searchTerm,
      });
      setFactors(res.data);
      setTotalPages(res.meta.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load emission factors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    fetchFactors();
  };

  const handleOpenModal = (factor = null) => {
    setCurrentFactor(factor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentFactor(null);
    setIsModalOpen(false);
  };

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emission Factors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage greenhouse gas emission factors and conversion rates.</p>
        </div>
        {canManage && (
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Factor
          </button>
        )}
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
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

      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-start mb-6">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factor (kg CO2e)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {canManage && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : factors.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">No emission factors found.</td>
                </tr>
              ) : (
                factors.map((factor) => (
                  <tr key={factor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{factor.source}</div>
                      {factor.description && <div className="text-sm text-gray-500 truncate max-w-xs">{factor.description}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{factor.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{Number(factor.factor).toFixed(4)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${factor.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {factor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleOpenModal(factor)} className="text-primary-600 hover:text-primary-900 mr-4">
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button onClick={() => handleDelete(factor.id)} className="text-red-600 hover:text-red-900">
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
          <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
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
