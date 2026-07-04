// backend/scripts/seedAdmin.js
// One-time bootstrap: creates the first ADMIN account so someone can log in
// and start creating HR/employee accounts through the app itself.
// Usage: node scripts/seedAdmin.js

import dotenv from 'dotenv';
import { getUsersCollection, getEmployeesCollection, client } from '../config/database.js';
import { hashPassword, generateUserId, generateEmployeeId, generateLoginId, generateTempPassword } from '../utils/helpers.js';

dotenv.config();

const run = async () => {
  const usersCollection = await getUsersCollection();
  const employeesCollection = await getEmployeesCollection();

  const existingAdmin = await usersCollection.findOne({ role: 'ADMIN', is_deleted: false });
  if (existingAdmin) {
    console.log('An ADMIN account already exists:', existingAdmin.login_id);
    await client.close();
    return;
  }

  const firstName = 'System';
  const lastName = 'Admin';
  const email = 'admin@company.local';
  const joinDate = new Date().toISOString().split('T')[0];

  const loginId = await generateLoginId(firstName, lastName, joinDate);
  const tempPassword = generateTempPassword();
  const hashedTempPassword = await hashPassword(tempPassword);
  const userId = generateUserId();
  const employeeId = generateEmployeeId();

  await usersCollection.insertOne({
    user_id: userId,
    login_id: loginId,
    email,
    password: hashedTempPassword,
    temp_password: tempPassword,
    role: 'ADMIN',
    first_name: firstName,
    last_name: lastName,
    join_date: new Date(joinDate),
    first_login: true,
    is_deleted: false
  });

  await employeesCollection.insertOne({
    employee_id: employeeId,
    user_id: userId,
    first_name: firstName,
    last_name: lastName,
    email,
    phone: null,
    department: 'Administration',
    position: 'System Administrator',
    basic_salary: 0,
    allowances: 0,
    deductions: 0,
    join_date: new Date(joinDate),
    is_deleted: false
  });

  console.log('Admin account created:');
  console.log('  Login ID:', loginId);
  console.log('  Temp Password:', tempPassword);

  await client.close();
};

run().catch((error) => {
  console.error('Seed Admin Error:', error);
  process.exit(1);
});
