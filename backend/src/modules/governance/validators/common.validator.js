const { z } = require('zod');

// ─── Param Schemas ───────────────────────────────────────────────

const idParamSchema = z.object({
  id: z.string().uuid('Valid ID is required'),
});

const policyIdParamSchema = z.object({
  policyId: z.string().uuid('Valid policy ID is required'),
});

const departmentIdParamSchema = z.object({
  departmentId: z.string().uuid('Valid department ID is required'),
});

// ─── Query Schemas ───────────────────────────────────────────────

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

module.exports = {
  idParamSchema,
  policyIdParamSchema,
  departmentIdParamSchema,
  paginationQuerySchema,
};
