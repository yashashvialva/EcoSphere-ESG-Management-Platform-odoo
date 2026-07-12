const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authenticate = require('../../../middleware/authenticate.middleware');
const validate = require('../../../middleware/validate.middleware');
const { loginSchema, registerSchema } = require('../validators/auth.validator');

const router = Router();

router.post('/login', validate({ body: loginSchema }), authController.login);
router.post('/register', validate({ body: registerSchema }), authController.register);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
