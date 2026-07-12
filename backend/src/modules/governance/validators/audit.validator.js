const { z } = require('zod');
const { AUDIT_STATUS, AUDIT_TYPE } = require('../constants/governance.constants');

const createAuditSchema = z.object({
  departmentId: z.string().uuid('Valid department ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  auditType: z.enum(Object.values(AUDIT_TYPE)),
  description: z.string().optional(),
  auditorEmployeeId: z.string().uuid('Valid auditor employee ID is required'),
  scheduledDate: z.coerce.date(),
});

const updateAuditSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150).optional(),
  description: z.string().optional(),
  auditorEmployeeId: z.string().uuid('Valid auditor employee ID is required').optional(),
  scheduledDate: z.coerce.date().optional(),
});

const updateAuditStatusSchema = z.object({
  status: z.enum(Object.values(AUDIT_STATUS)),
  overallRating: z.number().min(0).max(10).optional(),
  findingsSummary: z.string().optional(),
  completedDate: z.coerce.date().optional(),
});

module.exports = {
  createAuditSchema,
  updateAuditSchema,
  updateAuditStatusSchema,
};
