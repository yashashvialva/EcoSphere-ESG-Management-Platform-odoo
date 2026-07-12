import React, { useState, useEffect } from 'react';
import { X, ClipboardCheck } from 'lucide-react';
import { createAudit, getEmployees, getDepartments } from '../../../services/governanceApi';

export default function CreateAuditModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '', departmentId: '', auditType: 'INTERNAL', description: '', 
    auditorEmployeeId: '', scheduledDate: new Date().toISOString().split('T')[0]
  });
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getEmployees().then(res => setEmployees(res?.data || [])).catch(console.error);
      getDepartments().then(res => setDepartments(res?.data || [])).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await createAudit({
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString()
      });
      onSuccess(); 
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to schedule audit');
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
            <div className="p-2 bg-white rounded-lg shadow-sm"><ClipboardCheck className="h-5 w-5 text-emerald-600" /></div>
            <h2 className="text-xl font-bold text-slate-800">Schedule New Audit</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-colors"><X className="h-5 w-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Audit Title *</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" placeholder="e.g. Q3 Environmental Compliance Audit" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Audit Type *</label>
              <select required value={formData.auditType} onChange={e => setFormData({...formData, auditType: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all bg-white">
                <option value="INTERNAL">Internal</option>
                <option value="EXTERNAL">External</option>
                <option value="CERTIFICATION">Certification</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Scheduled Date *</label>
              <input type="date" required value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Auditor *</label>
            <select required value={formData.auditorEmployeeId} onChange={e => setFormData({...formData, auditorEmployeeId: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all bg-white">
              <option value="">Select an auditor...</option>
              {(employees || []).map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ( {emp.id} )</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Target Department *</label>
            <select required value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all bg-white">
              <option value="">Select a department...</option>
              {(departments || []).map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all resize-none" placeholder="What is the scope of this audit?" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-sm shadow-emerald-200 transition-all disabled:opacity-50">
              {loading ? 'Scheduling...' : 'Schedule Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
