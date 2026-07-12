import api from './api';

export const getEmployees = () => api.get('/governance/reference/employees');
export const getDepartments = () => api.get('/governance/reference/departments');

// ─── Policies ────────────────────────────────────────────────────────────────

export const getPolicies = (params) =>
  api.get('/governance/policies', { params });

export const getPolicyById = (id) =>
  api.get(`/governance/policies/${id}`);

export const createPolicy = (data) =>
  api.post('/governance/policies', data);

export const updatePolicy = (id, data) =>
  api.put(`/governance/policies/${id}`, data);

export const updatePolicyStatus = (id, status) =>
  api.patch(`/governance/policies/${id}/status`, { status });

export const deletePolicy = (id) =>
  api.delete(`/governance/policies/${id}`);

export const getAcknowledgementStats = (id) =>
  api.get(`/governance/policies/${id}/acknowledgement-stats`);

export const distributePolicy = (policyId, employeeIds) =>
  api.post(`/governance/policies/${policyId}/distribute`, { employeeIds });

// ─── Acknowledgements ───────────────────────────────────────────────────────

export const getAcknowledgements = (params) =>
  api.get('/governance/acknowledgements', { params });

export const getMyAcknowledgements = () =>
  api.get('/governance/acknowledgements/my');

export const acknowledgePolicy = (id) =>
  api.post(`/governance/acknowledgements/${id}/acknowledge`);

export const getOverdueAcknowledgements = () =>
  api.get('/governance/acknowledgements/overdue');

export const sendReminder = (id) =>
  api.post(`/governance/acknowledgements/${id}/remind`);

// ─── Audits ──────────────────────────────────────────────────────────────────

export const getAudits = (params) =>
  api.get('/governance/audits', { params });

export const getAuditById = (id) =>
  api.get(`/governance/audits/${id}`);

export const createAudit = (data) =>
  api.post('/governance/audits', data);

export const updateAudit = (id, data) =>
  api.put(`/governance/audits/${id}`, data);

export const updateAuditStatus = (id, data) =>
  api.patch(`/governance/audits/${id}/status`, data);

export const getAuditFindings = (id) =>
  api.get(`/governance/audits/${id}/findings`);

export const getAuditsByDepartment = (departmentId) =>
  api.get(`/governance/audits/department/${departmentId}`);

// ─── Compliance Issues ──────────────────────────────────────────────────────

export const getComplianceIssues = (params) =>
  api.get('/governance/compliance-issues', { params });

export const getComplianceIssueById = (id) =>
  api.get(`/governance/compliance-issues/${id}`);

export const createComplianceIssue = (data) =>
  api.post('/governance/compliance-issues', data);

export const updateComplianceIssue = (id, data) =>
  api.put(`/governance/compliance-issues/${id}`, data);

export const updateComplianceIssueStatus = (id, status) =>
  api.patch(`/governance/compliance-issues/${id}/status`, { status });

export const resolveComplianceIssue = (id, resolutionNotes) =>
  api.patch(`/governance/compliance-issues/${id}/resolve`, { resolutionNotes });

export const getComplianceIssuesByDepartment = (departmentId) =>
  api.get(`/governance/compliance-issues/department/${departmentId}`);

export const getOverdueComplianceIssues = () =>
  api.get('/governance/compliance-issues/overdue');
