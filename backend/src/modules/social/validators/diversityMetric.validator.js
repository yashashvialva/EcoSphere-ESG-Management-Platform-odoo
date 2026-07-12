const { z } = require('zod');

const createDiversityMetricSchema = z.object({
  departmentId: z.string().uuid(),
  reportingDate: z.string().datetime(), // ISO Date String
  metricType: z.string().min(2).max(50), // e.g., 'Gender', 'Ethnicity', 'Age Group'
  notes: z.string().min(2).max(255).optional(), // stores categories like 'Female', 'Male', etc.
  metricValue: z.number().nonnegative(),
  totalPopulation: z.number().int().nonnegative().optional(),
});

const queryDiversityMetricsSchema = z.object({
  departmentId: z.string().uuid().optional(),
  metricType: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

module.exports = {
  createDiversityMetricSchema,
  queryDiversityMetricsSchema
};
