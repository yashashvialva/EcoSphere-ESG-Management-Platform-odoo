const auditService = require('../services/audit.service');
const { success, created, paginated } = require('../../../shared/responses');

const listAudits = async (req, res, next) => {
  try {
    const { status, departmentId, auditType, page, limit } = req.query;
    const result = await auditService.getAllAudits(
      { status, departmentId, auditType },
      { page, limit }
    );
    return paginated(res, result.data, result.pagination, 'Audits retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getAuditById = async (req, res, next) => {
  try {
    const result = await auditService.getAuditById(req.params.id);
    return success(res, result, 'Audit retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const createAudit = async (req, res, next) => {
  try {
    const result = await auditService.createAudit(req.body);
    return created(res, result, 'Audit created successfully');
  } catch (err) {
    next(err);
  }
};

const updateAudit = async (req, res, next) => {
  try {
    const result = await auditService.updateAudit(req.params.id, req.body);
    return success(res, result, 'Audit updated successfully');
  } catch (err) {
    next(err);
  }
};

const updateAuditStatus = async (req, res, next) => {
  try {
    const { status, overallRating, findingsSummary, completedDate } = req.body;
    const result = await auditService.updateAuditStatus(req.params.id, status, {
      overallRating,
      findingsSummary,
      completedDate,
    });
    return success(res, result, 'Audit status updated successfully');
  } catch (err) {
    next(err);
  }
};

const getAuditFindings = async (req, res, next) => {
  try {
    const result = await auditService.getAuditFindings(req.params.id);
    return success(res, result, 'Audit findings retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getAuditsByDepartment = async (req, res, next) => {
  try {
    const result = await auditService.getAuditsByDepartment(req.params.departmentId);
    return success(res, result, 'Department audits retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listAudits,
  getAuditById,
  createAudit,
  updateAudit,
  updateAuditStatus,
  getAuditFindings,
  getAuditsByDepartment,
};
