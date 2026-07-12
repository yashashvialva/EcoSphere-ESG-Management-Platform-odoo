const policyService = require('../services/policy.service');
const { success, created, paginated } = require('../../../shared/responses');

const listPolicies = async (req, res, next) => {
  try {
    const { status, search, page, limit } = req.query;
    const result = await policyService.getAllPolicies(
      { status, search },
      { page, limit }
    );
    return paginated(res, result.data, result.pagination, 'Policies retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getPolicyById = async (req, res, next) => {
  try {
    const result = await policyService.getPolicyById(req.params.id);
    return success(res, result, 'Policy retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const createPolicy = async (req, res, next) => {
  try {
    const result = await policyService.createPolicy(req.body);
    return created(res, result, 'Policy created successfully');
  } catch (err) {
    next(err);
  }
};

const updatePolicy = async (req, res, next) => {
  try {
    const result = await policyService.updatePolicy(req.params.id, req.body);
    return success(res, result, 'Policy updated successfully');
  } catch (err) {
    next(err);
  }
};

const updatePolicyStatus = async (req, res, next) => {
  try {
    const result = await policyService.updatePolicyStatus(req.params.id, req.body.status);
    return success(res, result, 'Policy status updated successfully');
  } catch (err) {
    next(err);
  }
};

const deletePolicy = async (req, res, next) => {
  try {
    await policyService.deletePolicy(req.params.id);
    return success(res, null, 'Policy archived successfully');
  } catch (err) {
    next(err);
  }
};

const getAcknowledgementStats = async (req, res, next) => {
  try {
    const result = await policyService.getAcknowledgementStats(req.params.id);
    return success(res, result, 'Acknowledgement stats retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  updatePolicyStatus,
  deletePolicy,
  getAcknowledgementStats,
};
