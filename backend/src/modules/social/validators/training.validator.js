const { z } = require('zod');
const { CSR_STATUS } = require('../constants/csr.constants'); // Using the same status lifecycle

const createTrainingSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(10),
  categoryId: z.string().uuid(),
  pointsAwarded: z.number().int().nonnegative().default(0),
});

const updateTrainingSchema = z.object({
  title: z.string().min(5).max(255).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().uuid().optional(),
  pointsAwarded: z.number().int().nonnegative().optional(),
  status: z.nativeEnum(CSR_STATUS).optional(),
});

const completeTrainingSchema = z.object({
  score: z.number().min(0).max(100).optional(),
});

module.exports = {
  createTrainingSchema,
  updateTrainingSchema,
  completeTrainingSchema
};
