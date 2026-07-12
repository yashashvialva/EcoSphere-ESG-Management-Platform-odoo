const { z } = require('zod');

const submitParticipationSchema = z.object({
  proofFileUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const reviewParticipationSchema = z.object({
  employeeId: z.string().uuid('Invalid employee ID').optional(),
}).optional();

const queryParticipationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
});

const participationIdParamSchema = z.object({
  id: z.string().uuid('Invalid participation ID'),
});

module.exports = {
  submitParticipationSchema,
  reviewParticipationSchema,
  queryParticipationSchema,
  participationIdParamSchema,
};
