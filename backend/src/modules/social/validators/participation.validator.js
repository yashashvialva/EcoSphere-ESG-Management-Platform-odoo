const { z } = require('zod');
const { APPROVAL_STATUS } = require('../constants/csr.constants');

const createParticipationSchema = z.object({
  activityId: z.string().uuid("Invalid CSR Activity ID"),
  proofUrl: z.string().url("Must be a valid URL").optional(),
});

const evaluateParticipationSchema = z.object({
  status: z.enum([APPROVAL_STATUS.APPROVED, APPROVAL_STATUS.REJECTED]),
  pointsAwarded: z.number().int().nonnegative().optional(), // Can override the activity's default points
});

module.exports = {
  createParticipationSchema,
  evaluateParticipationSchema
};
