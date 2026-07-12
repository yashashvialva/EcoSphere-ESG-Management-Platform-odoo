import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../store/authStore';

const EsgGoalForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    departmentId: user?.departmentId || '',
    targetValue: '',
    unit: '',
    deadline: '',
    description: '',
    status: 'ON_TRACK',
    currentValue: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        departmentId: initialData.departmentId || user?.departmentId || '',
        targetValue: initialData.targetValue || '',
        currentValue: initialData.currentValue || 0,
        unit: initialData.unit || '',
        deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
        description: initialData.description || '',
        status: initialData.status || 'ON_TRACK',
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
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue),
      deadline: new Date(formData.deadline).toISOString(),
    };
    
    // If we're updating, we don't send departmentId
    if (initialData) {
      delete submitData.departmentId;
    }
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {user?.role === 'Administrator' && !initialData && (
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700">Target Value</label>
          <input
            type="number"
            id="targetValue"
            name="targetValue"
            step="0.01"
            min="0"
            value={formData.targetValue}
            onChange={handleChange}
            required
            className="mt-1 input-field"
            placeholder="e.g., 5000"
          />
        </div>
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
            placeholder="e.g., kg CO2e"
          />
        </div>
      </div>

      {initialData && (
        <div>
          <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700">Current Progress Value</label>
          <input
            type="number"
            id="currentValue"
            name="currentValue"
            step="0.01"
            min="0"
            value={formData.currentValue}
            onChange={handleChange}
            required
            className="mt-1 input-field"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="mt-1 input-field"
          />
        </div>
        
        {initialData && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 input-field"
            >
              <option value="ON_TRACK">On Track</option>
              <option value="AT_RISK">At Risk</option>
              <option value="ACHIEVED">Achieved</option>
              <option value="MISSED">Missed</option>
            </select>
          </div>
        )}
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
          placeholder="Optional context about this goal"
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
          {isLoading ? 'Saving...' : 'Save Goal'}
        </button>
      </div>
    </form>
  );
};

export default EsgGoalForm;
