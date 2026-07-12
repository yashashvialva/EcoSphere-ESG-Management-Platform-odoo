const { z } = require('zod');

const distributePolicySchema = z.object({
  employeeIds: z
    .array(z.string().uuid('Each employee ID must be a valid UUID'))
    .min(1, 'At least one employee ID is required'),
});

module.exports = {
  distributePolicySchema,
};
