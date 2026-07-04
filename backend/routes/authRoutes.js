// backend/routes/authRoutes.js

import express from 'express';
import {
  loginUser,
  changePassword,
  createEmployee,
  getUserProfile,
  getEmployeeProfile
} from '../controllers/authController.js';
import { verifyAuth, isAdmin, isEmployee } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * PUBLIC ROUTES (No authentication required)
 */

// Login
router.post('/login', loginUser);

/**
 * PROTECTED ROUTES (Authentication required)
 */

// Change password on first login
router.post('/change-password', verifyAuth, changePassword);

// Get user profile
router.get('/profile/:userId', verifyAuth, getUserProfile);

// Get employee profile
router.get('/employee/:employeeId', verifyAuth, getEmployeeProfile);

/**
 * ADMIN ONLY ROUTES
 */

// Create new employee (Admin only)
router.post('/create-employee', verifyAuth, isAdmin, createEmployee);

export default router;