// backend/controllers/authController.js

import { 
  generateLoginId, 
  generateTempPassword, 
  hashPassword, 
  verifyPassword, 
  generateToken,
  formatUserResponse,
  isValidEmail,
  isStrongPassword,
  generateUserId,
  generateEmployeeId
} from '../utils/helpers.js';
import { queryDatabase } from '../config/database.js';

// LOGIN USER with Login ID
export const loginUser = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Validate input
    if (!loginId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Login ID and password are required.' 
      });
    }

    // Find user by Login ID
    const query = `
      SELECT * FROM users 
      WHERE login_id = ? AND is_deleted = false
    `;
    const results = await queryDatabase(query, [loginId.toUpperCase()]);

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid Login ID or password.' 
      });
    }

    const user = results[0];

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid Login ID or password.' 
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.user_id,
      loginId: user.login_id,
      role: user.role,
      email: user.email
    });

    // Remove sensitive data from response
    const safeUser = {
      _id: user.user_id,
      loginId: user.login_id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      firstLogin: user.first_login
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// CHANGE PASSWORD on first login
export const changePassword = async (req, res) => {
  try {
    const { userId, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!userId || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.'
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in database
    const query = `
      UPDATE users 
      SET password = ?, temp_password = NULL, first_login = false, updated_at = NOW()
      WHERE user_id = ?
    `;
    await queryDatabase(query, [hashedPassword, userId]);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password. Please try again.'
    });
  }
};

// CREATE NEW USER/EMPLOYEE (Admin Only)
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      basicSalary,
      allowances,
      deductions,
      joinDate
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.'
      });
    }

    if (!position) {
      return res.status(400).json({
        success: false,
        message: 'Position is required.'
      });
    }

    if (!basicSalary || Number(basicSalary) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid basic salary is required.'
      });
    }

    // Check if email already exists
    const emailCheck = await queryDatabase(
      'SELECT id FROM users WHERE email = ? AND is_deleted = false',
      [email]
    );
    if (emailCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.'
      });
    }

    // Generate credentials
    const finalJoinDate = joinDate || new Date().toISOString().split('T')[0];
    const loginId = await generateLoginId(firstName, lastName, finalJoinDate);
    const tempPassword = generateTempPassword();
    const hashedTempPassword = await hashPassword(tempPassword);
    const userId = generateUserId();
    const employeeId = generateEmployeeId();

    // Start transaction-like behavior
    // Create user
    const userQuery = `
      INSERT INTO users (
        user_id, login_id, email, password, temp_password,
        role, first_name, last_name, join_date, first_login
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true)
    `;
    await queryDatabase(userQuery, [
      userId,
      loginId,
      email,
      hashedTempPassword,
      tempPassword,
      'EMPLOYEE',
      firstName,
      lastName,
      finalJoinDate
    ]);

    // Create employee
    const employeeQuery = `
      INSERT INTO employees (
        employee_id, user_id, first_name, last_name, email, phone,
        department, position, basic_salary, allowances, deductions, join_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await queryDatabase(employeeQuery, [
      employeeId,
      userId,
      firstName,
      lastName,
      email,
      phone || null,
      department || null,
      position,
      basicSalary,
      allowances || 0,
      deductions || 0,
      finalJoinDate
    ]);

    res.status(201).json({
      success: true,
      message: 'Employee account created successfully.',
      data: {
        _id: userId,
        loginId,
        email,
        role: 'EMPLOYEE',
        firstName,
        lastName,
        tempPassword,
        firstLogin: true
      }
    });
  } catch (error) {
    console.error('Create Employee Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create employee account. Please try again.'
    });
  }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT user_id, login_id, email, role, first_name, last_name, join_date
      FROM users
      WHERE user_id = ? AND is_deleted = false
    `;
    const results = await queryDatabase(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const user = results[0];
    res.status(200).json({
      success: true,
      user: {
        _id: user.user_id,
        loginId: user.login_id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        joinDate: user.join_date
      }
    });
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile.'
    });
  }
};

// GET EMPLOYEE PROFILE
export const getEmployeeProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const query = `
      SELECT * FROM employees
      WHERE employee_id = ? AND is_deleted = false
    `;
    const results = await queryDatabase(query, [employeeId]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }

    const employee = results[0];
    res.status(200).json({
      success: true,
      employee: {
        _id: employee.employee_id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        basicSalary: parseFloat(employee.basic_salary),
        allowances: parseFloat(employee.allowances),
        deductions: parseFloat(employee.deductions),
        joinDate: employee.join_date
      }
    });
  } catch (error) {
    console.error('Get Employee Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee profile.'
    });
  }
};