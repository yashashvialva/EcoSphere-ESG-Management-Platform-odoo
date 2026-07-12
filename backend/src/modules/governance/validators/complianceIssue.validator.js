const { z } = require('zod');
const { COMPLIANCE_STATUS, COMPLIANCE_SEVERITY } = require('../constants/governance.constants');

const createComplianceIssueSchema = z.object({
  auditId: z.string().uuid('Valid audit ID is required').optional(),
  departmentId: z.string().uuid('Valid department ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  severity: z.enum(Object.values(COMPLIANCE_SEVERITY)),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ownerEmployeeId: z.string().uuid('Valid owner employee ID is required'),
  dueDate: z.coerce.date(),
});

const updateComplianceIssueSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150).optional(),
  severity: z.enum(Object.values(COMPLIANCE_SEVERITY)).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  ownerEmployeeId: z.string().uuid('Valid owner employee ID is required').optional(),
  dueDate: z.coerce.date().optional(),
});

const updateComplianceIssueStatusSchema = z.object({
  status: z.enum(Object.values(COMPLIANCE_STATUS)),
});

const resolveComplianceIssueSchema = z.object({
  resolutionNotes: z.string().min(10, 'Resolution notes must be at least 10 characters'),
});

module.exports = {
  createComplianceIssueSchema,
  updateComplianceIssueSchema,
  updateComplianceIssueStatusSchema,
  resolveComplianceIssueSchema,
};
