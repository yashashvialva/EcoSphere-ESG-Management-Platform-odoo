/**
 * Notification service stub.
 * Will be replaced by the actual notification module when built.
 */

const createNotification = async ({ employeeId, type, title, message, relatedEntityType, relatedEntityId }) => {
  console.log(`📢 [NOTIFICATION STUB] To: ${employeeId} | Type: ${type} | ${title}: ${message}`);
  // TODO: Replace with actual notification creation via Prisma
  return {
    id: 'stub-notification-id',
    employeeId,
    notificationType: type,
    title,
    message,
    relatedEntityType,
    relatedEntityId,
    channel: 'IN_APP',
    status: 'SENT',
  };
};

module.exports = {
  createNotification,
};
