const { z } = require('zod');
const { POLICY_STATUS } = require('../constants/governance.constants');

const createPolicySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  policyCode: z.string().min(2, 'Policy code must be at least 2 characters').max(30),
  description: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  version: z.string().max(20),
  effectiveDate: z.coerce.date(),
  acknowledgementDueDate: z.coerce.date().optional(),
  ownerEmployeeId: z.string().uuid('Valid owner employee ID is required'),
});

const updatePolicySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150).optional(),
  description: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters').optional(),
  version: z.string().max(20).optional(),
  effectiveDate: z.coerce.date().optional(),
  acknowledgementDueDate: z.coerce.date().optional(),
});

const updatePolicyStatusSchema = z.object({
  status: z.enum(Object.values(POLICY_STATUS)),
});

module.exports = {
  createPolicySchema,
  updatePolicySchema,
  updatePolicyStatusSchema,
};
