const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../../config/jwt');
const authRepository = require('../repositories/authRepository');
const { AppError, ConflictError, NotFoundError } = require('../../../shared/errors/AppError');

class AuthService {
  async register({ firstName, lastName, email, password, departmentId }) {
    // Check if email already exists
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('An account with this email already exists.');
    }

    // Get default Employee role
    const defaultRole = await authRepository.getDefaultRole();
    if (!defaultRole) {
      throw new AppError('Default role not found. Please seed the database first.', 500);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create employee
    const employee = await authRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
      departmentId,
      roleId: defaultRole.id,
      totalXp: 0,
      isActive: true,
    });

    // Generate JWT
    const token = this._generateToken(employee);

    return {
      token,
      user: this._formatUser(employee),
    };
  }

  async login({ email, password }) {
    // Find user by email
    const employee = await authRepository.findByEmail(email);
    if (!employee) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (!employee.is_active) {
      throw new AppError('Your account has been deactivated. Contact an administrator.', 403);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Generate JWT
    const token = this._generateToken(employee);

    return {
      token,
      user: this._formatUser(employee),
    };
  }

  async getProfile(userId) {
    const employee = await authRepository.findById(userId);
    if (!employee) {
      throw new NotFoundError('User');
    }

    return this._formatUser(employee);
  }

  _generateToken(employee) {
    return jwt.sign(
      { id: employee.id, email: employee.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
  }

  _formatUser(employee) {
    return {
      id: employee.id,
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
      role: employee.role?.name || null,
      department: employee.department?.name || null,
      departmentId: employee.department_id,
      totalXp: employee.total_xp,
      permissions: employee.role?.permissions?.map((rp) => rp.permission.code) || [],
    };
  }
}

module.exports = new AuthService();
