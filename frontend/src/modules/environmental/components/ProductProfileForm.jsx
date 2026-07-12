import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../store/authStore';

const ProductProfileForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    departmentId: user?.departmentId || '',
    name: '',
    description: '',
    lifecycleStatus: 'DESIGN',
    carbonFootprint: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        departmentId: initialData.department_id || user?.departmentId || '',
        name: initialData.name || '',
        description: initialData.description || '',
        lifecycleStatus: initialData.lifecycleStatus || 'DESIGN',
        carbonFootprint: initialData.carbonFootprint || 0,
      });
    }
  }, [initialData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      carbonFootprint: parseFloat(formData.carbonFootprint),
    };
    
    // If we're updating, we don't send departmentId
    if (initialData) {
      delete submitData.departmentId;
    }
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {user?.roleName === 'Administrator' && !initialData && (
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
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 input-field"
          placeholder="e.g., EcoWidget Pro"
        />
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
          placeholder="Optional product description"
        />
      </div>

      {initialData && (
        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2">
          <div>
            <label htmlFor="lifecycleStatus" className="block text-sm font-medium text-gray-700">Lifecycle Status</label>
            <select
              id="lifecycleStatus"
              name="lifecycleStatus"
              value={formData.lifecycleStatus}
              onChange={handleChange}
              required
              className="mt-1 input-field"
            >
              <option value="DESIGN">Design Phase</option>
              <option value="MANUFACTURING">Manufacturing</option>
              <option value="DISTRIBUTION">Distribution</option>
              <option value="END_OF_LIFE">End of Life</option>
            </select>
          </div>
          <div>
            <label htmlFor="carbonFootprint" className="block text-sm font-medium text-gray-700">Carbon Footprint (kg CO2e)</label>
            <input
              type="number"
              id="carbonFootprint"
              name="carbonFootprint"
              step="0.01"
              min="0"
              value={formData.carbonFootprint}
              onChange={handleChange}
              required
              className="mt-1 input-field"
            />
          </div>
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
          disabled={isLoading || (!initialData && !formData.departmentId)}
          className="btn-primary"
        >
          {isLoading ? 'Saving...' : 'Save Product Profile'}
        </button>
      </div>
    </form>
  );
};

export default ProductProfileForm;
