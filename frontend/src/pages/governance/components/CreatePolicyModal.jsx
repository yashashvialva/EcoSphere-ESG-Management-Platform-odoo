import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { createPolicy, getEmployees } from '../../../services/governanceApi';

export default function CreatePolicyModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '', policyCode: '', description: '', content: '', version: '1.0',
    effectiveDate: new Date().toISOString().split('T')[0], ownerEmployeeId: ''
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getEmployees().then(res => setEmployees(res?.data || [])).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await createPolicy({
        ...formData,
        effectiveDate: new Date(formData.effectiveDate).toISOString()
      });
      onSuccess(); 
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm"><FileText className="h-5 w-5 text-emerald-600" /></div>
            <h2 className="text-xl font-bold text-slate-800">Create New Policy</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-colors"><X className="h-5 w-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Policy Title *</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" placeholder="e.g. Environmental Health" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Policy Code *</label>
              <input required value={formData.policyCode} onChange={e => setFormData({...formData, policyCode: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" placeholder="e.g. EHS-01" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Policy Owner *</label>
            <select required value={formData.ownerEmployeeId} onChange={e => setFormData({...formData, ownerEmployeeId: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all bg-white">
              <option value="">Select an owner...</option>
              {(employees || []).map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ( {emp.id} )</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Effective Date *</label>
              <input type="date" required value={formData.effectiveDate} onChange={e => setFormData({...formData, effectiveDate: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Version *</label>
              <input required value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Short Description</label>
            <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" placeholder="Brief summary" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Full Content *</label>
            <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all resize-none" placeholder="Enter the full text of the policy..." />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-sm shadow-emerald-200 transition-all disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
