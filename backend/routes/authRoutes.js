// backend/routes/authRoutes.js

import express from 'express';
import {
  loginUser,
  getSession,
  changePassword,
  createEmployee,
  getUserProfile,
  getEmployeeProfile
} from '../controllers/authController.js';
import { verifyAuth, isManager, isEmployee } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * PUBLIC ROUTES (No authentication required)
 */

// Login
router.post('/login', loginUser);

/**
 * PROTECTED ROUTES (Authentication required)
 */

// Get current session (used to restore login state on page refresh)
router.get('/session', verifyAuth, getSession);

// Change password on first login
router.post('/change-password', verifyAuth, changePassword);

// Get user profile
router.get('/profile/:userId', verifyAuth, getUserProfile);

// Get employee profile
router.get('/employee/:employeeId', verifyAuth, getEmployeeProfile);

/**
 * ADMIN / HR ROUTES
 */

// Create new employee (Admin or HR only)
router.post('/create-employee', verifyAuth, isManager, createEmployee);

export default router;