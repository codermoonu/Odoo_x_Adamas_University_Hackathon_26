// backend/routes/appRoutes.js

import express from 'express';
import {
  getMyProfile,
  getDashboard,
  getEmployees,
  getAdminSummary,
  getAttendance,
  markAttendance,
  getLeaves,
  applyLeave,
  updateLeaveStatus,
  getSalaryStructure,
  updateSalaryStructure,
  getPayslips,
  getPayslipById
} from '../controllers/appController.js';
import { verifyAuth, isManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require a logged-in user
router.use(verifyAuth);

router.get('/profile', getMyProfile);
router.get('/dashboard', getDashboard);

router.get('/employees', isManager, getEmployees);
router.get('/admin/summary', isManager, getAdminSummary);

router.get('/attendance', getAttendance);
router.post('/attendance', markAttendance);

router.get('/leave', getLeaves);
router.post('/leave', applyLeave);
router.patch('/leave/:id', isManager, updateLeaveStatus);

router.get('/salary-structure', getSalaryStructure);
router.put('/salary-structure', updateSalaryStructure);

router.get('/payslips', getPayslips);
router.get('/payslips/:id', getPayslipById);

export default router;
