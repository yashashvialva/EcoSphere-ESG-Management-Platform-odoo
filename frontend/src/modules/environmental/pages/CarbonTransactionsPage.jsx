import React, { useState, useEffect } from 'react';
import { Plus, Search, AlertCircle, FileText, Calendar, Building } from 'lucide-react';
import environmentalApi from '../services/environmentalApi';
import CarbonTransactionForm from '../components/CarbonTransactionForm';
import { useAuth } from '../../../store/authStore';
import { format } from 'date-fns';

const CarbonTransactionsPage = () => {
  const { hasPermission, user } = useAuth();
  const canManage = hasPermission('environmental.manage');
  const isAdmin = user?.roleName === 'Administrator';
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    departmentId: '',
    dateFrom: '',
    dateTo: '',
  });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      const queryParams = {
        page,
        limit: 10,
        ...filters
      };
      
      // Clean up empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) delete queryParams[key];
      });

      const res = await environmentalApi.getCarbonTransactions(queryParams);
      setTransactions(res.data);
      setTotalPages(res.meta.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load carbon transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await environmentalApi.createCarbonTransaction(data);
      fetchTransactions();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carbon Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Record and view organizational carbon emitting activities.</p>
        </div>
        {canManage && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Record Transaction
          </button>
        )}
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {isAdmin && (
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Department UUID</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="departmentId"
                  value={filters.departmentId}
                  onChange={handleFilterChange}
                  className="pl-9 input-field text-sm py-1.5"
                  placeholder="Filter by department..."
                />
              </div>
            </div>
          )}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="input-field text-sm py-1.5"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="input-field text-sm py-1.5"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => { setFilters({ departmentId: '', dateFrom: '', dateTo: '' }); setPage(1); }}
              className="btn-secondary text-sm py-1.5 h-[34px]"
            >
              Clear Filters
            </button>
          </div>
        </div>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emission (kg CO2e)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No carbon transactions found.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{format(new Date(tx.transaction_date), 'MMM dd, yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tx.department?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{tx.department?.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tx.emission_factor?.source}</div>
                      <div className="text-xs text-gray-500">{tx.source_type} {tx.reference_id && `• Ref: ${tx.reference_id}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Number(tx.quantity).toLocaleString()} <span className="text-gray-500 text-xs ml-1">{tx.emission_factor?.unit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {Number(tx.emission_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Record Carbon Transaction
                  </h3>
                </div>
                <CarbonTransactionForm 
                  onSubmit={handleSubmit} 
                  onCancel={() => setIsModalOpen(false)}
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

export default CarbonTransactionsPage;
