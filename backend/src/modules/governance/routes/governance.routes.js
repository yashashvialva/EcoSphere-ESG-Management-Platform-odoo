const { Router } = require('express');
const authenticate = require('../../../middleware/authenticate.middleware');
const authorize = require('../../../middleware/authorize.middleware');
const validate = require('../../../middleware/validate.middleware');

// Controllers
const policyController = require('../controllers/policy.controller');
const acknowledgementController = require('../controllers/acknowledgement.controller');
const auditController = require('../controllers/audit.controller');
const complianceIssueController = require('../controllers/complianceIssue.controller');
const referenceRoutes = require('./reference.routes');

// Validators – body schemas
const {
  createPolicySchema,
  updatePolicySchema,
  updatePolicyStatusSchema,
} = require('../validators/policy.validator');
const { distributePolicySchema } = require('../validators/acknowledgement.validator');
const {
  createAuditSchema,
  updateAuditSchema,
  updateAuditStatusSchema,
} = require('../validators/audit.validator');
const {
  createComplianceIssueSchema,
  updateComplianceIssueSchema,
  updateComplianceIssueStatusSchema,
  resolveComplianceIssueSchema,
} = require('../validators/complianceIssue.validator');

// Validators – param / query schemas
const {
  idParamSchema,
  policyIdParamSchema,
  departmentIdParamSchema,
} = require('../validators/common.validator');

const router = Router();

// All governance routes require authentication
router.use(authenticate);

// ─── Reference Data ─────────────────────────────────────────────
router.use('/reference', referenceRoutes);

// ─── ESG Policies ────────────────────────────────────────────────

router.get('/policies', policyController.listPolicies);

router.get(
  '/policies/:id',
  validate({ params: idParamSchema }),
  policyController.getPolicyById
);

router.post(
  '/policies',
  authorize('governance.manage_policies'),
  validate({ body: createPolicySchema }),
  policyController.createPolicy
);

router.put(
  '/policies/:id',
  authorize('governance.manage_policies'),
  validate({ params: idParamSchema, body: updatePolicySchema }),
  policyController.updatePolicy
);

router.patch(
  '/policies/:id/status',
  authorize('governance.manage_policies'),
  validate({ params: idParamSchema, body: updatePolicyStatusSchema }),
  policyController.updatePolicyStatus
);

router.delete(
  '/policies/:id',
  authorize('governance.manage_policies'),
  validate({ params: idParamSchema }),
  policyController.deletePolicy
);

router.get(
  '/policies/:id/acknowledgement-stats',
  validate({ params: idParamSchema }),
  policyController.getAcknowledgementStats
);

// ─── Policy Acknowledgements ─────────────────────────────────────

router.get('/acknowledgements', acknowledgementController.listAcknowledgements);

router.get('/acknowledgements/my', acknowledgementController.getMyAcknowledgements);

router.get(
  '/acknowledgements/overdue',
  authorize('governance.manage_policies'),
  acknowledgementController.getOverdueAcknowledgements
);

router.post(
  '/acknowledgements/:id/acknowledge',
  validate({ params: idParamSchema }),
  acknowledgementController.acknowledgePolicy
);

router.post(
  '/acknowledgements/:id/remind',
  authorize('governance.manage_policies'),
  validate({ params: idParamSchema }),
  acknowledgementController.sendReminder
);

router.post(
  '/policies/:policyId/distribute',
  authorize('governance.manage_policies'),
  validate({ params: policyIdParamSchema, body: distributePolicySchema }),
  acknowledgementController.distributePolicy
);

// ─── Audits ──────────────────────────────────────────────────────

router.get('/audits', auditController.listAudits);

router.get(
  '/audits/department/:departmentId',
  validate({ params: departmentIdParamSchema }),
  auditController.getAuditsByDepartment
);

router.get(
  '/audits/:id',
  validate({ params: idParamSchema }),
  auditController.getAuditById
);

router.post(
  '/audits',
  authorize('governance.manage_audits'),
  validate({ body: createAuditSchema }),
  auditController.createAudit
);

router.put(
  '/audits/:id',
  authorize('governance.manage_audits'),
  validate({ params: idParamSchema, body: updateAuditSchema }),
  auditController.updateAudit
);

router.patch(
  '/audits/:id/status',
  authorize('governance.manage_audits'),
  validate({ params: idParamSchema, body: updateAuditStatusSchema }),
  auditController.updateAuditStatus
);

router.get(
  '/audits/:id/findings',
  validate({ params: idParamSchema }),
  auditController.getAuditFindings
);

// ─── Compliance Issues ───────────────────────────────────────────

router.get('/compliance-issues', complianceIssueController.listComplianceIssues);

router.get(
  '/compliance-issues/overdue',
  authorize('governance.manage_compliance'),
  complianceIssueController.getOverdueComplianceIssues
);

router.get(
  '/compliance-issues/department/:departmentId',
  validate({ params: departmentIdParamSchema }),
  complianceIssueController.getComplianceIssuesByDepartment
);

router.get(
  '/compliance-issues/:id',
  validate({ params: idParamSchema }),
  complianceIssueController.getComplianceIssueById
);

router.post(
  '/compliance-issues',
  authorize('governance.manage_compliance'),
  validate({ body: createComplianceIssueSchema }),
  complianceIssueController.createComplianceIssue
);

router.put(
  '/compliance-issues/:id',
  authorize('governance.manage_compliance'),
  validate({ params: idParamSchema, body: updateComplianceIssueSchema }),
  complianceIssueController.updateComplianceIssue
);

router.patch(
  '/compliance-issues/:id/status',
  authorize('governance.manage_compliance'),
  validate({ params: idParamSchema, body: updateComplianceIssueStatusSchema }),
  complianceIssueController.updateComplianceIssueStatus
);

router.patch(
  '/compliance-issues/:id/resolve',
  authorize('governance.manage_compliance'),
  validate({ params: idParamSchema, body: resolveComplianceIssueSchema }),
  complianceIssueController.resolveComplianceIssue
);

module.exports = router;
