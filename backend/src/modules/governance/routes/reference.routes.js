const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { ApiResponse } = require('../../../shared/responses/apiResponse');

const prisma = new PrismaClient();
const router = Router();

router.get('/employees', async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: 'asc' },
    });
    res.json(ApiResponse.success(employees, 'Employees retrieved'));
  } catch (error) {
    next(error);
  }
});

router.get('/departments', async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' },
    });
    res.json(ApiResponse.success(departments, 'Departments retrieved'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
