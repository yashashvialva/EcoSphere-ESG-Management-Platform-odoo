/**
 * Standardized API response helpers.
 * Every controller should use these instead of raw res.json().
 */

const success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const created = (res, data, message = 'Created successfully') => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

const paginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

const noContent = (res) => {
  return res.status(204).send();
};

const error = (res, statusCode, code, message, details = null, requestId = null) => {
  const response = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  if (requestId) {
    response.error.requestId = requestId;
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  success,
  created,
  paginated,
  noContent,
  error,
};
