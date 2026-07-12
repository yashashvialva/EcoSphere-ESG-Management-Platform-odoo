import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { createComplianceIssue, getEmployees, getDepartments } from '../../../services/governanceApi';

export default function CreateComplianceIssueModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '', departmentId: '', severity: 'LOW', description: '', 
    ownerEmployeeId: '', dueDate: new Date().toISOString().split('T')[0]
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
      await createComplianceIssue({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      });
      onSuccess(); 
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to log issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <h2 className="text-xl font-bold text-slate-800">Log Compliance Issue</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-colors"><X className="h-5 w-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Issue Title *</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" placeholder="e.g. Missing Safety Documentation" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Severity *</label>
              <select required value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all bg-white">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Due Date *</label>
              <input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Issue Owner *</label>
            <select required value={formData.ownerEmployeeId} onChange={e => setFormData({...formData, ownerEmployeeId: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all bg-white">
              <option value="">Assign to...</option>
              {(employees || []).map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ( {emp.id} )</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Department *</label>
            <select required value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all bg-white">
              <option value="">Select department...</option>
              {(departments || []).map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Description *</label>
            <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all resize-none" placeholder="Provide details about the compliance issue..." />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-sm shadow-red-200 transition-all disabled:opacity-50">
              {loading ? 'Logging...' : 'Log Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
