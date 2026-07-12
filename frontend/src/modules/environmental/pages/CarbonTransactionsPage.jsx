import React, { useState, useEffect } from 'react';
import { Plus, Search, AlertCircle, Recycle, Calendar, Building } from 'lucide-react';
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
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ departmentId: '', dateFrom: '', dateTo: '' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchTransactions(); }, [page, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const queryParams = { page, limit: 10, ...filters };
      Object.keys(queryParams).forEach(key => { if (!queryParams[key]) delete queryParams[key]; });
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
    <>
      <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl" style={{ background: '#9BBDAF22' }}>
            <Recycle className="h-6 w-6" style={{ color: '#5E9E6F' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>Carbon Transactions</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Record and view organizational carbon emitting activities.</p>
          </div>
        </div>
        {canManage && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Record Transaction
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {isAdmin && (
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#2F2F2F' }}>Department UUID</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#836A78' }} />
                <input type="text" name="departmentId" value={filters.departmentId} onChange={handleFilterChange} className="pl-9 input-field text-sm py-2" placeholder="Filter by department..." />
              </div>
            </div>
          )}
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#2F2F2F' }}>Date From</label>
            <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="input-field text-sm py-2" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#2F2F2F' }}>Date To</label>
            <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="input-field text-sm py-2" />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setFilters({ departmentId: '', dateFrom: '', dateTo: '' }); setPage(1); }}
              className="btn-ghost text-sm py-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl flex items-start border" style={{ background: '#E96A6A11', borderColor: '#E96A6A33' }}>
          <AlertCircle className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: '#E96A6A' }} />
          <p className="text-sm" style={{ color: '#E96A6A' }}>{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="table-card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr style={{ background: '#F8C7AE22' }}>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Activity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Emission (kg CO2e)</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#ECE8E3' }}>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm" style={{ color: '#6B7280' }}>Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm" style={{ color: '#6B7280' }}>No carbon transactions found.</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="transition-colors duration-150"
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF8C9'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" style={{ color: '#836A78' }} />
                        <span className="text-sm" style={{ color: '#2F2F2F' }}>{format(new Date(tx.transactionDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold" style={{ color: '#2F2F2F' }}>{tx.department?.name || 'Unknown'}</div>
                      <div className="text-xs" style={{ color: '#6B7280' }}>{tx.department?.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold" style={{ color: '#2F2F2F' }}>{tx.emissionFactor?.source}</div>
                      <div className="text-xs" style={{ color: '#6B7280' }}>{tx.sourceType} {tx.referenceId && `• Ref: ${tx.referenceId}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#2F2F2F' }}>
                      {Number(tx.quantity).toLocaleString()} <span className="text-xs ml-1" style={{ color: '#6B7280' }}>{tx.emissionFactor?.unit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="chip-error">
                        {Number(tx.emissionValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          {/* Scrollable Container */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full justify-center p-4 pt-16 sm:pt-24 pb-16">
              <div className="relative bg-white rounded-2xl shadow-lg max-w-lg w-full border h-fit" style={{ borderColor: '#ECE8E3' }}>
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center mb-4 space-x-3">
                    <div className="p-2 rounded-xl" style={{ background: '#9BBDAF22' }}>
                      <Recycle className="h-5 w-5" style={{ color: '#5E9E6F' }} />
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: '#2F2F2F' }}>Record Carbon Transaction</h3>
                  </div>
                  <CarbonTransactionForm onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} isLoading={isSubmitting} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarbonTransactionsPage;
