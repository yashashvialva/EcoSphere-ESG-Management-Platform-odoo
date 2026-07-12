import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../store/authStore';
import api from '../../../services/api';

const ProductProfileForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
  const { user } = useAuth();
  const [emissionFactors, setEmissionFactors] = useState([]);
  
  const [formData, setFormData] = useState({
    departmentId: user?.departmentId || '',
    name: '',
    emissionFactorId: '',
    recyclable: false,
    sustainabilityRating: 0,
  });

  useEffect(() => {
    // Fetch emission factors for the dropdown
    api.get('/environmental/emission-factors')
      .then(res => {
        if (res.data?.data) {
          setEmissionFactors(res.data.data);
        } else if (res.data) {
           setEmissionFactors(res.data);
        }
      })
      .catch(err => console.error('Failed to load emission factors', err));

    if (initialData) {
      setFormData({
        departmentId: initialData.department_id || user?.departmentId || '',
        name: initialData.name || '',
        emissionFactorId: initialData.emissionFactorId || '',
        recyclable: initialData.recyclable || false,
        sustainabilityRating: initialData.sustainabilityRating || 0,
      });
    }
  }, [initialData, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      sustainabilityRating: parseInt(formData.sustainabilityRating, 10),
    };
    
    // Clear empty emission factor ID so fallback logic in repo handles it
    if (!submitData.emissionFactorId) {
      delete submitData.emissionFactorId;
    }
    
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
        <label htmlFor="emissionFactorId" className="block text-sm font-medium text-gray-700">Emission Factor (Category)</label>
        <select
          id="emissionFactorId"
          name="emissionFactorId"
          value={formData.emissionFactorId}
          onChange={handleChange}
          className="mt-1 input-field"
        >
          <option value="">-- Select a Category --</option>
          {Array.isArray(emissionFactors) && emissionFactors.map(ef => (
            <option key={ef.id} value={ef.id}>{ef.category} - {ef.source}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="recyclable"
          name="recyclable"
          checked={formData.recyclable}
          onChange={handleChange}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
        <label htmlFor="recyclable" className="ml-2 block text-sm text-gray-900">
          Is this product recyclable?
        </label>
      </div>

      <div>
        <label htmlFor="sustainabilityRating" className="block text-sm font-medium text-gray-700">Sustainability Rating (0 - 5)</label>
        <input
          type="number"
          id="sustainabilityRating"
          name="sustainabilityRating"
          min="0"
          max="5"
          value={formData.sustainabilityRating}
          onChange={handleChange}
          required
          className="mt-1 input-field"
        />
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
