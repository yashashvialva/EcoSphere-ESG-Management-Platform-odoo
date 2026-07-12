const complianceIssueService = require('../services/complianceIssue.service');
const { success, created, paginated } = require('../../../shared/responses');

const listComplianceIssues = async (req, res, next) => {
  try {
    const { status, severity, departmentId, auditId, page, limit } = req.query;
    const result = await complianceIssueService.getAllComplianceIssues(
      { status, severity, departmentId, auditId },
      { page, limit }
    );
    return paginated(res, result.data, result.pagination, 'Compliance issues retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getComplianceIssueById = async (req, res, next) => {
  try {
    const result = await complianceIssueService.getComplianceIssueById(req.params.id);
    return success(res, result, 'Compliance issue retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const createComplianceIssue = async (req, res, next) => {
  try {
    const data = { ...req.body, createdByEmployeeId: req.user.id };
    const result = await complianceIssueService.createComplianceIssue(data);
    return created(res, result, 'Compliance issue created successfully');
  } catch (err) {
    next(err);
  }
};

const updateComplianceIssue = async (req, res, next) => {
  try {
    const result = await complianceIssueService.updateComplianceIssue(req.params.id, req.body);
    return success(res, result, 'Compliance issue updated successfully');
  } catch (err) {
    next(err);
  }
};

const updateComplianceIssueStatus = async (req, res, next) => {
  try {
    const result = await complianceIssueService.updateComplianceIssueStatus(
      req.params.id,
      req.body.status
    );
    return success(res, result, 'Compliance issue status updated successfully');
  } catch (err) {
    next(err);
  }
};

const resolveComplianceIssue = async (req, res, next) => {
  try {
    const result = await complianceIssueService.resolveComplianceIssue(req.params.id, req.body);
    return success(res, result, 'Compliance issue resolved successfully');
  } catch (err) {
    next(err);
  }
};

const getComplianceIssuesByDepartment = async (req, res, next) => {
  try {
    const result = await complianceIssueService.getComplianceIssuesByDepartment(
      req.params.departmentId
    );
    return success(res, result, 'Department compliance issues retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getOverdueComplianceIssues = async (req, res, next) => {
  try {
    const result = await complianceIssueService.getOverdueComplianceIssues();
    return success(res, result, 'Overdue compliance issues retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listComplianceIssues,
  getComplianceIssueById,
  createComplianceIssue,
  updateComplianceIssue,
  updateComplianceIssueStatus,
  resolveComplianceIssue,
  getComplianceIssuesByDepartment,
  getOverdueComplianceIssues,
};
