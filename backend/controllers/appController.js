// backend/controllers/appController.js

import { ObjectId } from 'mongodb';
import {
  getEmployeesCollection,
  getAttendanceCollection,
  getLeavesCollection,
  getPayslipsCollection
} from '../config/database.js';

const DEFAULT_COMPONENTS = [
  { key: "basic", name: "Basic", type: "percentage", base: "wage", value: 50 },
  { key: "hra", name: "House Rent Allowance", type: "percentage", base: "basic", value: 50 },
  { key: "standardAllowance", name: "Standard Allowance", type: "fixed", base: "wage", value: 4167 },
  { key: "performanceBonus", name: "Performance Bonus", type: "percentage", base: "wage", value: 8.33 },
  { key: "lta", name: "Leave Travel Allowance", type: "percentage", base: "wage", value: 8.333 }
];

const getEmployeeForUser = async (userId) => {
  const employeesCollection = await getEmployeesCollection();
  return employeesCollection.findOne({ user_id: userId, is_deleted: false });
};

const isManagerRole = (role) => role === 'ADMIN' || role === 'HR';

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// GET /api/profile
export const getMyProfile = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.status(200).json({
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      isDeleted: employee.is_deleted
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

// GET /api/dashboard
export const getDashboard = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const attendanceCollection = await getAttendanceCollection();
    const leavesCollection = await getLeavesCollection();
    const payslipsCollection = await getPayslipsCollection();

    const currentMonthAttendance = await attendanceCollection.countDocuments({
      employee_id: employee.employee_id,
      status: 'PRESENT',
      date: { $gte: monthStart, $lt: monthEnd }
    });

    const pendingLeaves = await leavesCollection.countDocuments({
      employee_id: employee.employee_id,
      status: 'PENDING'
    });

    const latestPayslip = await payslipsCollection.find({ employee_id: employee.employee_id })
      .sort({ year: -1, month: -1 })
      .limit(1)
      .toArray();

    res.status(200).json({
      currentMonthAttendance,
      pendingLeaves,
      latestPayslip: latestPayslip[0] ? { netSalary: latestPayslip[0].net_salary } : null,
      employee: {
        firstName: employee.first_name,
        lastName: employee.last_name,
        position: employee.position,
        department: employee.department
      }
    });
  } catch (error) {
    console.error('Get Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard.' });
  }
};

// GET /api/employees (Admin/HR only)
export const getEmployees = async (req, res) => {
  try {
    const employeesCollection = await getEmployeesCollection();
    const employees = await employeesCollection.find({ is_deleted: false }).sort({ join_date: -1 }).toArray();

    res.status(200).json({
      data: employees.map((e) => ({
        _id: e.employee_id,
        userId: e.user_id,
        firstName: e.first_name,
        lastName: e.last_name,
        email: e.email,
        phone: e.phone,
        department: e.department,
        position: e.position,
        basicSalary: e.basic_salary,
        joinDate: e.join_date
      }))
    });
  } catch (error) {
    console.error('Get Employees Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employees.' });
  }
};

// GET /api/admin/summary (Admin/HR only)
export const getAdminSummary = async (req, res) => {
  try {
    const employeesCollection = await getEmployeesCollection();
    const attendanceCollection = await getAttendanceCollection();
    const leavesCollection = await getLeavesCollection();

    const totalEmployees = await employeesCollection.countDocuments({ is_deleted: false });

    const todayStart = startOfDay(new Date());
    const todayEnd = addDays(todayStart, 1);
    const presentToday = await attendanceCollection.countDocuments({
      date: { $gte: todayStart, $lt: todayEnd },
      status: 'PRESENT'
    });

    const pendingLeaves = await leavesCollection.countDocuments({ status: 'PENDING' });

    res.status(200).json({ totalEmployees, presentToday, pendingLeaves });
  } catch (error) {
    console.error('Get Admin Summary Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch summary.' });
  }
};

// GET /api/attendance
export const getAttendance = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user.userId);
    const attendanceCollection = await getAttendanceCollection();

    let records;
    let employeeMap = new Map();
    if (isManagerRole(req.user.role)) {
      const todayStart = startOfDay(new Date());
      const todayEnd = addDays(todayStart, 1);
      records = await attendanceCollection.find({
        date: { $gte: todayStart, $lt: todayEnd }
      }).toArray();

      const employeesCollection = await getEmployeesCollection();
      const employeeIds = [...new Set(records.map((r) => r.employee_id))];
      const employees = await employeesCollection.find({ employee_id: { $in: employeeIds } }).toArray();
      employeeMap = new Map(employees.map((e) => [e.employee_id, e]));
    } else {
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found.' });
      }
      records = await attendanceCollection.find({
        employee_id: employee.employee_id
      }).sort({ date: -1 }).toArray();
    }

    const data = records.map((r) => {
      const emp = employeeMap.get(r.employee_id);
      return {
        _id: r._id.toString(),
        employeeId: r.employee_id,
        employeeName: emp ? `${emp.first_name} ${emp.last_name}` : undefined,
        date: r.date,
        checkIn: r.check_in,
        checkOut: r.check_out,
        status: r.status,
        workingHours: r.working_hours,
        dayType: r.day_type
      };
    });

    res.status(200).json({
      data,
      employee: { isDeleted: employee?.is_deleted || false }
    });
  } catch (error) {
    console.error('Get Attendance Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance.' });
  }
};

// POST /api/attendance (toggle check-in / check-out)
export const markAttendance = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const attendanceCollection = await getAttendanceCollection();
    const todayStart = startOfDay(new Date());
    const todayEnd = addDays(todayStart, 1);

    const existing = await attendanceCollection.findOne({
      employee_id: employee.employee_id,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    if (!existing) {
      await attendanceCollection.insertOne({
        employee_id: employee.employee_id,
        date: todayStart,
        check_in: new Date(),
        check_out: null,
        status: 'PRESENT',
        working_hours: null,
        day_type: null
      });
    } else if (existing.check_in && !existing.check_out) {
      const checkOutTime = new Date();
      const hours = (checkOutTime.getTime() - new Date(existing.check_in).getTime()) / (1000 * 60 * 60);
      const dayType = hours >= 8 ? 'Full Day' : hours >= 6 ? 'Three Quarter Day' : hours >= 4 ? 'Half Day' : 'Short Day';

      await attendanceCollection.updateOne(
        { _id: existing._id },
        { $set: { check_out: checkOutTime, working_hours: hours, day_type: dayType } }
      );
    }

    res.status(200).json({ success: true, message: 'Attendance recorded.' });
  } catch (error) {
    console.error('Mark Attendance Error:', error);
    res.status(500).json({ success: false, message: 'Failed to record attendance.' });
  }
};

// GET /api/leave
export const getLeaves = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user.userId);
    const leavesCollection = await getLeavesCollection();

    let records;
    if (isManagerRole(req.user.role)) {
      const employeesCollection = await getEmployeesCollection();
      records = await leavesCollection.find({}).sort({ created_at: -1 }).toArray();
      const employeeIds = [...new Set(records.map((r) => r.employee_id))];
      const employees = await employeesCollection.find({ employee_id: { $in: employeeIds } }).toArray();
      const employeeMap = new Map(employees.map((e) => [e.employee_id, e]));

      return res.status(200).json({
        data: records.map((r) => ({
          _id: r._id.toString(),
          type: r.type,
          startDate: r.start_date,
          endDate: r.end_date,
          reason: r.reason,
          status: r.status,
          remarks: r.remarks,
          employeeName: (() => {
            const emp = employeeMap.get(r.employee_id);
            return emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
          })()
        })),
        employee: { isDeleted: false }
      });
    }

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    records = await leavesCollection.find({ employee_id: employee.employee_id }).sort({ created_at: -1 }).toArray();

    res.status(200).json({
      data: records.map((r) => ({
        _id: r._id.toString(),
        type: r.type,
        startDate: r.start_date,
        endDate: r.end_date,
        reason: r.reason,
        status: r.status,
        remarks: r.remarks
      })),
      employee: { isDeleted: employee.is_deleted }
    });
  } catch (error) {
    console.error('Get Leaves Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leave records.' });
  }
};

// POST /api/leave
export const applyLeave = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const { type, reason, startDate, endDate } = req.body;
    if (!type || !reason || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const leavesCollection = await getLeavesCollection();
    await leavesCollection.insertOne({
      employee_id: employee.employee_id,
      type,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      reason,
      status: 'PENDING',
      remarks: null,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ success: true, message: 'Leave request submitted.' });
  } catch (error) {
    console.error('Apply Leave Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit leave request.' });
  }
};

// PATCH /api/leave/:id (Admin only - approve/reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be APPROVED or REJECTED.' });
    }

    const leavesCollection = await getLeavesCollection();
    const result = await leavesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, remarks: remarks || null, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    res.status(200).json({ success: true, message: `Leave ${status.toLowerCase()}.` });
  } catch (error) {
    console.error('Update Leave Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update leave status.' });
  }
};

// GET /api/salary-structure
export const getSalaryStructure = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const ss = employee.salary_structure;
    res.status(200).json({
      wage: ss?.wage ?? employee.basic_salary,
      components: ss?.components ?? DEFAULT_COMPONENTS,
      pfRate: ss?.pf_rate ?? 12,
      professionalTax: ss?.professional_tax ?? 200
    });
  } catch (error) {
    console.error('Get Salary Structure Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch salary structure.' });
  }
};

// PUT /api/salary-structure
export const updateSalaryStructure = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const { wage, components, pfRate, professionalTax } = req.body;
    const employeesCollection = await getEmployeesCollection();
    await employeesCollection.updateOne(
      { employee_id: employee.employee_id },
      {
        $set: {
          salary_structure: {
            wage: Number(wage) || 0,
            components: components || DEFAULT_COMPONENTS,
            pf_rate: Number(pfRate) || 0,
            professional_tax: Number(professionalTax) || 0
          }
        }
      }
    );

    res.status(200).json({ success: true, message: 'Salary structure updated.' });
  } catch (error) {
    console.error('Update Salary Structure Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update salary structure.' });
  }
};

const computeSalaryAmounts = (ss) => {
  const wage = ss.wage;
  const components = ss.components;
  const basicComponent = components.find((c) => c.key === 'basic');
  const basicAmount = !basicComponent ? 0
    : basicComponent.type === 'fixed' ? Number(basicComponent.value) || 0
    : (wage * (Number(basicComponent.value) || 0)) / 100;

  let componentsTotal = 0;
  const amounts = {};
  components.forEach((c) => {
    let amount;
    if (c.key === 'basic') amount = basicAmount;
    else if (c.type === 'fixed') amount = Number(c.value) || 0;
    else {
      const base = c.base === 'basic' ? basicAmount : wage;
      amount = (base * (Number(c.value) || 0)) / 100;
    }
    amounts[c.key] = amount;
    componentsTotal += amount;
  });

  const fixedAllowance = Math.max(wage - componentsTotal, 0);
  const grossTotal = componentsTotal + fixedAllowance;

  return { basicAmount, grossTotal };
};

// Generates (once) or returns the existing payslip for the given month/year
const generateOrGetPayslip = async (employee, month, year) => {
  const payslipsCollection = await getPayslipsCollection();
  const existing = await payslipsCollection.findOne({
    employee_id: employee.employee_id,
    month,
    year
  });
  if (existing) return existing;

  const ss = {
    wage: employee.salary_structure?.wage ?? employee.basic_salary,
    components: employee.salary_structure?.components ?? DEFAULT_COMPONENTS,
    pfRate: employee.salary_structure?.pf_rate ?? 12,
    professionalTax: employee.salary_structure?.professional_tax ?? 200
  };

  const { basicAmount, grossTotal } = computeSalaryAmounts(ss);

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 1);
  const daysInMonth = new Date(year, month, 0).getDate();

  // Unpaid leave (ANNUAL type) reduces payable days
  const leavesCollection = await getLeavesCollection();
  const unpaidLeaves = await leavesCollection.find({
    employee_id: employee.employee_id,
    type: 'ANNUAL',
    status: 'APPROVED',
    start_date: { $lt: monthEnd },
    end_date: { $gte: monthStart }
  }).toArray();

  let unpaidDays = 0;
  unpaidLeaves.forEach((leave) => {
    const start = new Date(Math.max(new Date(leave.start_date).getTime(), monthStart.getTime()));
    const end = new Date(Math.min(new Date(leave.end_date).getTime(), monthEnd.getTime() - 1));
    const days = Math.max(Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1, 0);
    unpaidDays += days;
  });

  const payableDays = Math.max(daysInMonth - unpaidDays, 0);
  const proportion = payableDays / daysInMonth;

  const basicSalary = Math.round(basicAmount * proportion);
  const allowances = Math.round((grossTotal - basicAmount) * proportion);
  const pfAmount = Math.round((basicAmount * ss.pfRate) / 100);
  const deductions = Math.round(pfAmount + ss.professionalTax);
  const netSalary = basicSalary + allowances - deductions;

  const payslip = {
    employee_id: employee.employee_id,
    month,
    year,
    basic_salary: basicSalary,
    allowances,
    deductions,
    net_salary: netSalary,
    payable_days: payableDays,
    created_at: new Date(),
    updated_at: new Date()
  };

  const result = await payslipsCollection.insertOne(payslip);
  return { ...payslip, _id: result.insertedId };
};

// GET /api/payslips
export const getPayslips = async (req, res) => {
  try {
    const employee = await getEmployeeForUser(req.user.userId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const now = new Date();
    await generateOrGetPayslip(employee, now.getMonth() + 1, now.getFullYear());

    const payslipsCollection = await getPayslipsCollection();
    const records = await payslipsCollection.find({ employee_id: employee.employee_id })
      .sort({ year: -1, month: -1 })
      .toArray();

    res.status(200).json({
      data: records.map((r) => ({
        _id: r._id.toString(),
        month: r.month,
        year: r.year,
        basicSalary: r.basic_salary,
        allowances: r.allowances,
        deductions: r.deductions,
        netSalary: r.net_salary,
        payableDays: r.payable_days
      }))
    });
  } catch (error) {
    console.error('Get Payslips Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payslips.' });
  }
};

// GET /api/payslips/:id
export const getPayslipById = async (req, res) => {
  try {
    const { id } = req.params;
    const payslipsCollection = await getPayslipsCollection();
    const payslip = await payslipsCollection.findOne({ _id: new ObjectId(id) });
    if (!payslip) {
      return res.status(404).json({ message: 'Payslip not found.' });
    }

    const employeesCollection = await getEmployeesCollection();
    const employee = await employeesCollection.findOne({ employee_id: payslip.employee_id });

    res.status(200).json({
      month: payslip.month,
      year: payslip.year,
      basicSalary: payslip.basic_salary,
      allowances: payslip.allowances,
      deductions: payslip.deductions,
      netSalary: payslip.net_salary,
      employee: employee ? {
        firstName: employee.first_name,
        lastName: employee.last_name,
        position: employee.position,
        email: employee.email
      } : null
    });
  } catch (error) {
    console.error('Get Payslip Error:', error);
    res.status(500).json({ message: 'Failed to fetch payslip.' });
  }
};
