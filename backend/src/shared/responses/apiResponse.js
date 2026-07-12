/**
 * Standardized API response helper
 * All controllers should use this for consistency
 */
class ApiResponse {
  /**
   * Success response
   * @param {*} data - Response payload
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @param {object} meta - Pagination metadata
   */
  static success(data = null, message = 'Success', statusCode = 200, meta = null) {
    const response = {
      success: true,
      statusCode,
      message,
      data,
    };

    if (meta) {
      response.meta = meta;
    }

    return response;
  }

  /**
   * Error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Array} errors - Validation errors array
   */
  static error(message = 'Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      statusCode,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return response;
  }

  /**
   * Paginated response
   * @param {Array} data - Array of records
   * @param {number} total - Total record count
   * @param {number} page - Current page
   * @param {number} limit - Records per page
   * @param {string} message - Success message
   */
  static paginated(data, total, page, limit, message = 'Success') {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }
}

module.exports = { ApiResponse };
