// ============================================================
// Governance Module – Constants
// ============================================================

const POLICY_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
});

const ACKNOWLEDGEMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  OVERDUE: 'OVERDUE',
});

const AUDIT_STATUS = Object.freeze({
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
});

const AUDIT_TYPE = Object.freeze({
  INTERNAL: 'INTERNAL',
  EXTERNAL: 'EXTERNAL',
  COMPLIANCE: 'COMPLIANCE',
  ESG: 'ESG',
});

const COMPLIANCE_SEVERITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
});

const COMPLIANCE_STATUS = Object.freeze({
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
});

const PAGINATION_DEFAULTS = Object.freeze({
  page: 1,
  limit: 10,
});

module.exports = {
  POLICY_STATUS,
  ACKNOWLEDGEMENT_STATUS,
  AUDIT_STATUS,
  AUDIT_TYPE,
  COMPLIANCE_SEVERITY,
  COMPLIANCE_STATUS,
  PAGINATION_DEFAULTS,
};
