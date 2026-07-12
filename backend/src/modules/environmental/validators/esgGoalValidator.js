const { z } = require('zod');

const createEsgGoalSchema = z.object({
  departmentId: z.string().uuid('Invalid department ID'),
  targetValue: z.number().positive('Target value must be positive'),
  unit: z.string().min(1).max(20),
  deadline: z.string().datetime({ message: 'Invalid deadline date' }),
  description: z.string().max(500).optional(),
});

const updateEsgGoalSchema = z.object({
  targetValue: z.number().positive().optional(),
  unit: z.string().min(1).max(20).optional(),
  deadline: z.string().datetime().optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['ON_TRACK', 'AT_RISK', 'ACHIEVED', 'MISSED']).optional(),
  currentValue: z.number().nonnegative().optional(),
});

module.exports = { createEsgGoalSchema, updateEsgGoalSchema };
