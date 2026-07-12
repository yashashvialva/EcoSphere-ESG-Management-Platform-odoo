const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../../../middleware/validate');
const { authenticate } = require('../../../middleware/auth');
const { registerSchema, loginSchema } = require('../validators/authValidator');

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes
router.get('/me', authenticate, authController.getProfile);

module.exports = router;
