const { z } = require('zod');

const createDiversityMetricSchema = z.object({
  departmentId: z.string().uuid(),
  date: z.string().datetime(), // ISO Date String
  metricType: z.string().min(2).max(50), // e.g., 'Gender', 'Ethnicity', 'Age Group'
  metricName: z.string().min(2).max(100), // e.g., 'Female', 'Hispanic', '25-34'
  value: z.number().nonnegative(),
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
