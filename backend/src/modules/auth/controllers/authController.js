const authService = require('../services/authService');
const { ApiResponse } = require('../../../shared/responses/apiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(
        ApiResponse.success(result, 'Registration successful.', 201)
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(
        ApiResponse.success(result, 'Login successful.')
      );
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      res.status(200).json(
        ApiResponse.success(user, 'Profile retrieved.')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
