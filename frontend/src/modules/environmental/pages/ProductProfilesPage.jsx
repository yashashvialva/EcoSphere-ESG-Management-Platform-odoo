import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Package } from 'lucide-react';
import environmentalApi from '../services/environmentalApi';
import ProductProfileForm from '../components/ProductProfileForm';
import { useAuth } from '../../../store/authStore';

const ProductProfilesPage = () => {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('environmental.manage');
  
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [page]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await environmentalApi.getProductProfiles({
        page,
        limit: 10,
      });
      setProfiles(res.data);
      setTotalPages(res.meta.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load product profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (profile = null) => {
    setCurrentProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentProfile(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (currentProfile) {
        await environmentalApi.updateProductProfile(currentProfile.id, data);
      } else {
        await environmentalApi.createProductProfile(data);
      }
      fetchProfiles();
      handleCloseModal();
    } catch (err) {
      alert(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product profile?')) {
      try {
        await environmentalApi.deleteProductProfile(id);
        fetchProfiles();
      } catch (err) {
        alert(err.message || 'Failed to delete product profile.');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DESIGN': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Design</span>;
      case 'MANUFACTURING': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Manufacturing</span>;
      case 'DISTRIBUTION': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Distribution</span>;
      case 'END_OF_LIFE': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">End of Life</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Profiles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product lifecycle carbon footprints.</p>
        </div>
        {canManage && (
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Product Profile
          </button>
        )}
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lifecycle Phase</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Footprint (kg CO2e)</th>
                {canManage && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">No product profiles found.</td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                          {profile.description && (
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">{profile.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profile.department?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{profile.department?.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(profile.lifecycle_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{Number(profile.carbonFootprint).toLocaleString()}</span>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleOpenModal(profile)} className="text-primary-600 hover:text-primary-900 mr-4">
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button onClick={() => handleDelete(profile.id)} className="text-red-600 hover:text-red-900">
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
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                    <Package className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {currentProfile ? 'Edit Product Profile' : 'Add Product Profile'}
                  </h3>
                </div>
                <ProductProfileForm 
                  initialData={currentProfile} 
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

export default ProductProfilesPage;
