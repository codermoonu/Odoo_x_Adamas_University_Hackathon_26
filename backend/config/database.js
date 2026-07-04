// backend/config/database.js

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Create MongoDB client
export const client = new MongoClient(process.env.MONGODB_URI);

let db;

// Connect (idempotent) and return the database handle
export const connectDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db();
  }
  return db;
};

// Test connection
export const testConnection = async () => {
  try {
    const database = await connectDB();
    await database.command({ ping: 1 });
    console.log('✅ MongoDB Database Connected');
    return true;
  } catch (error) {
    console.error('❌ Database Connection Failed:', error.message);
    return false;
  }
};

// Collection helpers
export const getUsersCollection = async () => {
  const database = await connectDB();
  return database.collection('users');
};

export const getEmployeesCollection = async () => {
  const database = await connectDB();
  return database.collection('employees');
};

export const getAttendanceCollection = async () => {
  const database = await connectDB();
  return database.collection('attendance');
};

export const getLeavesCollection = async () => {
  const database = await connectDB();
  return database.collection('leaves');
};

export const getPayslipsCollection = async () => {
  const database = await connectDB();
  return database.collection('payslips');
};

// Export client as default
export default client;
