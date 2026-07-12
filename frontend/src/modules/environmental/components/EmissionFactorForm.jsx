import React, { useState, useEffect } from 'react';

const EmissionFactorForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    source: '',
    unit: '',
    factor: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        source: initialData.source || '',
        unit: initialData.unit || '',
        factor: initialData.factor || '',
        description: initialData.description || '',
        isActive: initialData.is_active !== undefined ? initialData.is_active : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      factor: parseFloat(formData.factor),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
        <input
          type="text"
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          required
          className="mt-1 input-field"
          placeholder="e.g., Electricity (Grid)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            className="mt-1 input-field"
            placeholder="e.g., kWh"
          />
        </div>
        <div>
          <label htmlFor="factor" className="block text-sm font-medium text-gray-700">Factor (kg CO2e)</label>
          <input
            type="number"
            id="factor"
            name="factor"
            step="0.0001"
            min="0"
            value={formData.factor}
            onChange={handleChange}
            required
            className="mt-1 input-field"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 input-field"
          placeholder="Optional description"
        />
      </div>

      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>

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
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default EmissionFactorForm;
