const { z } = require('zod');
const { CSR_STATUS } = require('../constants/csr.constants');

const createCsrActivitySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().uuid("Invalid category ID"),
  startDate: z.string().datetime({ message: "Invalid ISO datetime string for start date" }),
  endDate: z.string().datetime({ message: "Invalid ISO datetime string for end date" }),
  location: z.string().optional(),
  maxParticipants: z.number().int().positive().optional(),
  pointsAwarded: z.number().int().nonnegative().default(0),
});

const updateCsrActivitySchema = z.object({
  title: z.string().min(5).max(255).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  location: z.string().optional(),
  maxParticipants: z.number().int().positive().optional(),
  pointsAwarded: z.number().int().nonnegative().optional(),
  status: z.nativeEnum(CSR_STATUS).optional()
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) < new Date(data.endDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});

const queryCsrActivitiesSchema = z.object({
  status: z.nativeEnum(CSR_STATUS).optional(),
  categoryId: z.string().uuid().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
});

module.exports = {
  createCsrActivitySchema,
  updateCsrActivitySchema,
  queryCsrActivitiesSchema
};
