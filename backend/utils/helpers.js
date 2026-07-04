// backend/utils/helpers.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getUsersCollection } from '../config/database.js';

// Generate Login ID
// Format: OI + First 2 letters of first name + First 2 letters of last name + Year of joining + Serial number
export const generateLoginId = async (firstName, lastName, joinDate) => {
  try {
    const year = new Date(joinDate).getFullYear();
    const first2FirstName = (firstName || '').substring(0, 2).toUpperCase();
    const first2LastName = (lastName || '').substring(0, 2).toUpperCase();

    // Get count of users joining in the same year
    const usersCollection = await getUsersCollection();
    const count = await usersCollection.countDocuments({
      $expr: { $eq: [{ $year: '$join_date' }, year] },
      is_deleted: false
    });
    const nextSerial = (count || 0) + 1;
    const serialNumber = String(nextSerial).padStart(4, '0');

    return `OI${first2FirstName}${first2LastName}${year}${serialNumber}`;
  } catch (error) {
    console.error('Error generating Login ID:', error);
    throw error;
  }
};

// Generate temporary password (12 characters)
export const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Hash password with bcrypt
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

// Compare password with hash
export const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
};

// Generate JWT token
export const generateToken = (userData) => {
  try {
    return jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Error verifying JWT:', error);
    throw new Error('Invalid or expired token');
  }
};

// Generate unique user ID
export const generateUserId = () => {
  return `user_${uuidv4().slice(0, 8)}`;
};

// Generate unique employee ID
export const generateEmployeeId = () => {
  return `emp_${uuidv4().slice(0, 8)}`;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Format user response (remove sensitive data)
export const formatUserResponse = (user) => {
  const { password, temp_password, ...safeUser } = user;
  return safeUser;
};

// Format employee response
export const formatEmployeeResponse = (employee) => {
  return {
    ...employee,
    basicSalary: parseFloat(employee.basic_salary),
    allowances: parseFloat(employee.allowances),
    deductions: parseFloat(employee.deductions)
  };
};