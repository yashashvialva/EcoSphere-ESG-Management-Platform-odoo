const acknowledgementService = require('../services/acknowledgement.service');
const { success, created, paginated } = require('../../../shared/responses');

const listAcknowledgements = async (req, res, next) => {
  try {
    const { policyId, employeeId, status, page, limit } = req.query;
    const result = await acknowledgementService.getAllAcknowledgements(
      { policyId, employeeId, status },
      { page, limit }
    );
    return paginated(res, result.data, result.pagination, 'Acknowledgements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getMyAcknowledgements = async (req, res, next) => {
  try {
    const result = await acknowledgementService.getMyAcknowledgements(req.user.id);
    return success(res, result, 'Your acknowledgements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const acknowledgePolicy = async (req, res, next) => {
  try {
    const result = await acknowledgementService.acknowledgePolicy(req.params.id, req.user.id);
    return success(res, result, 'Policy acknowledged successfully');
  } catch (err) {
    next(err);
  }
};

const distributePolicy = async (req, res, next) => {
  try {
    const result = await acknowledgementService.distributePolicy(
      req.params.policyId,
      req.body.employeeIds
    );
    return created(res, result, 'Policy distributed successfully');
  } catch (err) {
    next(err);
  }
};

const getOverdueAcknowledgements = async (req, res, next) => {
  try {
    const result = await acknowledgementService.getOverdueAcknowledgements();
    return success(res, result, 'Overdue acknowledgements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const sendReminder = async (req, res, next) => {
  try {
    const result = await acknowledgementService.sendReminder(req.params.id);
    return success(res, result, 'Reminder sent successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listAcknowledgements,
  getMyAcknowledgements,
  acknowledgePolicy,
  distributePolicy,
  getOverdueAcknowledgements,
  sendReminder,
};
