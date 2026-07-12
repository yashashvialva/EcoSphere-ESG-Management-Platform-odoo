import React, { useState, useEffect } from 'react';
import environmentalApi from '../services/environmentalApi';
import { useAuth } from '../../../store/authStore';

const CarbonTransactionForm = ({ onSubmit, onCancel, isLoading }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    departmentId: user?.departmentId || '', // Default to user's department
    emissionFactorId: '',
    sourceType: 'PURCHASE',
    referenceId: '',
    quantity: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });
  
  const [emissionFactors, setEmissionFactors] = useState([]);
  const [loadingFactors, setLoadingFactors] = useState(false);

  useEffect(() => {
    // Fetch active emission factors for the dropdown
    const fetchFactors = async () => {
      try {
        setLoadingFactors(true);
        const res = await environmentalApi.getEmissionFactors({ limit: 100 });
        // Filter only active factors
        setEmissionFactors(res.data.filter(f => f.is_active));
      } catch (err) {
        console.error("Failed to load emission factors", err);
      } finally {
        setLoadingFactors(false);
      }
    };
    fetchFactors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert date to ISO string
    const dateObj = new Date(formData.transactionDate);
    const isoDate = dateObj.toISOString();

    onSubmit({
      ...formData,
      quantity: parseFloat(formData.quantity),
      transactionDate: isoDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {user?.roleName === 'Administrator' && (
        <div>
          <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">Department ID</label>
          <input
            type="text"
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
            className="mt-1 input-field text-sm"
            placeholder="UUID..."
          />
          <p className="mt-1 text-xs text-gray-500">Admins can specify department UUID directly.</p>
        </div>
      )}

      <div>
        <label htmlFor="emissionFactorId" className="block text-sm font-medium text-gray-700">Emission Factor</label>
        <select
          id="emissionFactorId"
          name="emissionFactorId"
          value={formData.emissionFactorId}
          onChange={handleChange}
          required
          disabled={loadingFactors}
          className="mt-1 input-field"
        >
          <option value="">Select an emission factor</option>
          {emissionFactors.map((factor) => (
            <option key={factor.id} value={factor.id}>
              {factor.source} ({factor.factor} kg CO2e / {factor.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sourceType" className="block text-sm font-medium text-gray-700">Source Type</label>
          <select
            id="sourceType"
            name="sourceType"
            value={formData.sourceType}
            onChange={handleChange}
            required
            className="mt-1 input-field"
          >
            <option value="PURCHASE">Purchase</option>
            <option value="MANUFACTURING">Manufacturing</option>
            <option value="FLEET">Fleet</option>
            <option value="EXPENSE">Expense</option>
            <option value="MANUAL">Manual Entry</option>
          </select>
        </div>
        <div>
          <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">Transaction Date</label>
          <input
            type="date"
            id="transactionDate"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleChange}
            required
            className="mt-1 input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            step="0.01"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="mt-1 input-field"
            placeholder="0.00"
          />
        </div>
        <div>
          <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700">Reference ID (Optional)</label>
          <input
            type="text"
            id="referenceId"
            name="referenceId"
            value={formData.referenceId}
            onChange={handleChange}
            className="mt-1 input-field"
            placeholder="e.g., PO-12345"
          />
        </div>
      </div>

      {formData.emissionFactorId && formData.quantity && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-4">
          <h4 className="text-sm font-medium text-gray-700">Auto-Calculated Emission Value:</h4>
          <p className="text-2xl font-bold text-primary-600 mt-1">
            {(() => {
              const selectedFactor = emissionFactors.find(f => f.id === formData.emissionFactorId);
              if (selectedFactor) {
                return (parseFloat(formData.quantity) * parseFloat(selectedFactor.factor)).toFixed(2);
              }
              return '0.00';
            })()} 
            <span className="text-sm font-normal text-gray-500 ml-1">kg CO2e</span>
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !formData.departmentId}
          className="btn-primary"
        >
          {isLoading ? 'Recording...' : 'Record Transaction'}
        </button>
      </div>
    </form>
  );
};

export default CarbonTransactionForm;
