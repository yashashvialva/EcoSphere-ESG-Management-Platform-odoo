const { z } = require('zod');

const createProductProfileSchema = z.object({
  departmentId: z.string().uuid('Invalid department ID'),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

const updateProductProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  lifecycleStatus: z.enum(['DESIGN', 'MANUFACTURING', 'DISTRIBUTION', 'END_OF_LIFE']).optional(),
  carbonFootprint: z.number().nonnegative().optional(),
});

module.exports = { createProductProfileSchema, updateProductProfileSchema };
