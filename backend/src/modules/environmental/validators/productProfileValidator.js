const { z } = require('zod');

const createProductProfileSchema = z.object({
  departmentId: z.string().uuid('Invalid department ID'),
  name: z.string().min(2).max(100),
  emissionFactorId: z.string().uuid('Invalid emission factor ID').optional().or(z.literal('')),
  recyclable: z.boolean().optional(),
  sustainabilityRating: z.number().min(0).max(5).optional(),
});

const updateProductProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  emissionFactorId: z.string().uuid('Invalid emission factor ID').optional().or(z.literal('')),
  recyclable: z.boolean().optional(),
  sustainabilityRating: z.number().min(0).max(5).optional(),
});

module.exports = { createProductProfileSchema, updateProductProfileSchema };
