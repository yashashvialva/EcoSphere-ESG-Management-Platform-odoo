const { z } = require('zod');

const createEmissionFactorSchema = z.object({
  source: z.string().min(2, 'Source must be at least 2 characters').max(100),
  unit: z.string().min(1, 'Unit is required').max(20),
  factor: z.number().positive('Factor must be a positive number'),
  description: z.string().max(500).optional(),
});

const updateEmissionFactorSchema = z.object({
  source: z.string().min(2).max(100).optional(),
  unit: z.string().min(1).max(20).optional(),
  factor: z.number().positive().optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

module.exports = { createEmissionFactorSchema, updateEmissionFactorSchema };
