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
import { getUsersCollection, getEmployeesCollection } from '../config/database.js';

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
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({
      login_id: loginId.toUpperCase(),
      is_deleted: false
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Login ID or password.'
      });
    }

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

// GET CURRENT SESSION (validates token, returns the logged-in user)
export const getSession = async (req, res) => {
  try {
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({
      user_id: req.user.userId,
      is_deleted: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

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
      user: safeUser
    });
  } catch (error) {
    console.error('Get Session Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session.'
    });
  }
};

// CHANGE PASSWORD on first login
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
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

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ user_id: userId, is_deleted: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in database
    await usersCollection.updateOne(
      { user_id: userId },
      {
        $set: {
          password: hashedPassword,
          temp_password: null,
          first_login: false,
          updated_at: new Date()
        }
      }
    );

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
      joinDate,
      role
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

    const finalRole = role || 'EMPLOYEE';
    if (!['EMPLOYEE', 'HR', 'ADMIN'].includes(finalRole)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be EMPLOYEE, HR, or ADMIN.'
      });
    }

    if (!basicSalary || Number(basicSalary) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid basic salary is required.'
      });
    }

    // Check if email already exists
    const usersCollection = await getUsersCollection();
    const employeesCollection = await getEmployeesCollection();

    const existingUser = await usersCollection.findOne({
      email,
      is_deleted: false
    });
    if (existingUser) {
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
    await usersCollection.insertOne({
      user_id: userId,
      login_id: loginId,
      email,
      password: hashedTempPassword,
      temp_password: tempPassword,
      role: finalRole,
      first_name: firstName,
      last_name: lastName,
      join_date: new Date(finalJoinDate),
      first_login: true,
      is_deleted: false
    });

    // Create employee
    await employeesCollection.insertOne({
      employee_id: employeeId,
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      department: department || null,
      position,
      basic_salary: Number(basicSalary),
      allowances: Number(allowances || 0),
      deductions: Number(deductions || 0),
      join_date: new Date(finalJoinDate),
      is_deleted: false
    });

    res.status(201).json({
      success: true,
      message: 'Employee account created successfully.',
      data: {
        _id: userId,
        loginId,
        email,
        role: finalRole,
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

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne(
      { user_id: userId, is_deleted: false },
      {
        projection: {
          user_id: 1,
          login_id: 1,
          email: 1,
          role: 1,
          first_name: 1,
          last_name: 1,
          join_date: 1
        }
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

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

    const employeesCollection = await getEmployeesCollection();
    const employee = await employeesCollection.findOne({
      employee_id: employeeId,
      is_deleted: false
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }

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