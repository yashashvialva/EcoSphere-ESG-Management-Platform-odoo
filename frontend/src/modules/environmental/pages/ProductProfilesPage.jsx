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
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchProfiles(); }, [page]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await environmentalApi.getProductProfiles({ page, limit: 10 });
      setProfiles(res.data);
      setTotalPages(res.meta.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load product profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (profile = null) => { setCurrentProfile(profile); setIsModalOpen(true); };
  const handleCloseModal = () => { setCurrentProfile(null); setIsModalOpen(false); };

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
      case 'DESIGN': return <span className="chip-info">Design</span>;
      case 'MANUFACTURING': return <span className="chip-warning">Manufacturing</span>;
      case 'DISTRIBUTION': return <span className="chip-mauve">Distribution</span>;
      case 'END_OF_LIFE': return <span className="chip-gray">End of Life</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl" style={{ background: '#836A7822' }}>
            <Package className="h-6 w-6" style={{ color: '#836A78' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>Product Profiles</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Manage product lifecycle carbon footprints.</p>
          </div>
        </div>
        {canManage && (
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Product Profile
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#ECE8E3' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ background: '#F8C7AE22' }}>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Lifecycle Phase</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Footprint (kg CO2e)</th>
                {canManage && <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#ECE8E3' }}>
              {loading ? (
                <tr><td colSpan={canManage ? 5 : 4} className="px-6 py-10 text-center text-sm" style={{ color: '#6B7280' }}>Loading...</td></tr>
              ) : profiles.length === 0 ? (
                <tr><td colSpan={canManage ? 5 : 4} className="px-6 py-10 text-center text-sm" style={{ color: '#6B7280' }}>No product profiles found.</td></tr>
              ) : (
                profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="transition-colors duration-150"
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF8C9'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center mr-4" style={{ background: '#836A7822' }}>
                          <Package className="h-5 w-5" style={{ color: '#836A78' }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: '#2F2F2F' }}>{profile.name}</div>
                          {profile.description && (
                            <div className="text-xs truncate max-w-[200px]" style={{ color: '#6B7280' }}>{profile.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold" style={{ color: '#2F2F2F' }}>{profile.department?.name || 'Unknown'}</div>
                      <div className="text-xs" style={{ color: '#6B7280' }}>{profile.department?.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(profile.lifecycle_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono" style={{ color: '#2F2F2F' }}>
                      {Number(profile.carbon_footprint).toLocaleString()}
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                        <button onClick={() => handleOpenModal(profile)} className="transition-colors" style={{ color: '#9BBDAF' }} onMouseEnter={e => e.currentTarget.style.color = '#5E9E6F'} onMouseLeave={e => e.currentTarget.style.color = '#9BBDAF'}>
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button onClick={() => handleDelete(profile.id)} className="transition-colors" style={{ color: '#E96A6A88' }} onMouseEnter={e => e.currentTarget.style.color = '#E96A6A'} onMouseLeave={e => e.currentTarget.style.color = '#E96A6A88'}>
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
                <div className="flex items-center mb-4 space-x-3">
                  <div className="p-2 rounded-xl" style={{ background: '#836A7822' }}>
                    <Package className="h-5 w-5" style={{ color: '#836A78' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#2F2F2F' }}>
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
