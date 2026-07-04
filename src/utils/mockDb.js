// Mock Database for HRMS Application using LocalStorage

// Helper to load or initialize data
const getStorageItem = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error("Error parsing localstorage key:", key, e);
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Function to generate Login ID
// Format: OI + First 2 letters of first name + First 2 letters of last name + Year of joining + Serial number
const generateLoginId = (firstName, lastName, joinDate) => {
  const year = new Date(joinDate).getFullYear();
  const first2FirstName = (firstName || "").substring(0, 2).toUpperCase();
  const first2LastName = (lastName || "").substring(0, 2).toUpperCase();
  
  // Get all users to find the max serial for this year
  const users = getStorageItem("hrms_users", []);
  const usersInYear = users.filter(u => {
    const userYear = new Date(u.joinDate).getFullYear();
    return userYear === year;
  });
  
  const nextSerial = usersInYear.length + 1;
  const serialNumber = String(nextSerial).padStart(4, '0');
  
  return `OI${first2FirstName}${first2LastName}${year}${serialNumber}`;
};

// Function to generate temporary password
const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Initial data templates from assets.jsx
const initialEmployees = [
  {
    _id: "69b414a7f8a807df391d7b58",
    firstName: "David",
    lastName: "Michael",
    email: "david@example.com",
    phone: "9000000001",
    department: "IT Support",
    position: "Associate Business Support",
    basicSalary: 1000,
    allowances: 100,
    deductions: 9.98,
    employmentStatus: "ACTIVE",
    joinDate: "2024-01-20",
    image: null,
    isDeleted: false,
    bio: "Passionate about support operations and network troubleshooting.",
    createdAt: "2026-03-13T13:44:07.806Z"
  },
  {
    _id: "69b41439f8a807df391d7b52",
    firstName: "Alex",
    lastName: "Matthew",
    email: "alex@example.com",
    phone: "9000000002",
    department: "Engineering",
    position: "Software Developer",
    basicSalary: 2000,
    allowances: 150,
    deductions: 20.00,
    employmentStatus: "ACTIVE",
    joinDate: "2024-05-15",
    image: null,
    isDeleted: false,
    bio: "Frontend Developer focusing on React and interactive animations.",
    createdAt: "2026-03-13T13:42:17.589Z"
  },
  {
    _id: "69b411e6f8a807df391d7b13",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phone: "9000000003",
    department: "Engineering",
    position: "Senior Software Developer",
    basicSalary: 4000,
    allowances: 400,
    deductions: 80.00,
    employmentStatus: "ACTIVE",
    joinDate: "2023-01-20",
    image: null,
    isDeleted: false,
    bio: "Hi, I am dev a full stack web developer.",
    createdAt: "2026-03-13T13:32:22.013Z"
  }
];

const initialUsers = [
  {
    _id: "admin-default-id",
    loginId: "OIADOW20260001",
    email: "admin@example.com",
    password: "Admin@123456",
    tempPassword: null,
    role: "ADMIN",
    firstName: "Admin",
    lastName: "Owner",
    joinDate: "2026-01-01",
    firstLogin: false,
    createdAt: "2026-03-13T13:32:22.013Z"
  },
  {
    _id: "69b414a7f8a807df391d7b58",
    loginId: "OIDAMI20240001",
    email: "david@example.com",
    password: "TempPass@1234",
    tempPassword: "TempPass@1234",
    role: "EMPLOYEE",
    firstName: "David",
    lastName: "Michael",
    joinDate: "2024-01-20",
    firstLogin: true,
    createdAt: "2026-03-13T13:44:07.806Z"
  },
  {
    _id: "69b41439f8a807df391d7b52",
    loginId: "OIAMAM20240002",
    email: "alex@example.com",
    password: "TempPass@1234",
    tempPassword: "TempPass@1234",
    role: "EMPLOYEE",
    firstName: "Alex",
    lastName: "Matthew",
    joinDate: "2024-05-15",
    firstLogin: true,
    createdAt: "2026-03-13T13:42:17.589Z"
  },
  {
    _id: "69b411e6f8a807df391d7b13",
    loginId: "OIJODO20230001",
    email: "johndoe@example.com",
    password: "TempPass@1234",
    tempPassword: "TempPass@1234",
    role: "EMPLOYEE",
    firstName: "John",
    lastName: "Doe",
    joinDate: "2023-01-20",
    firstLogin: true,
    createdAt: "2026-03-13T13:32:22.013Z"
  }
];

const initialLeaves = [
  {
    _id: "69b4165af8a807df391d7bfd",
    employeeId: "69b41439f8a807df391d7b52",
    type: "ANNUAL",
    startDate: "2026-03-27",
    endDate: "2026-03-29",
    reason: "Out for a trip",
    status: "APPROVED",
    createdAt: "2026-03-13T13:51:22.716Z"
  },
  {
    _id: "69b4163cf8a807df391d7bf8",
    employeeId: "69b41439f8a807df391d7b52",
    type: "CASUAL",
    startDate: "2026-03-23",
    endDate: "2026-03-24",
    reason: "Going For Vacations",
    status: "REJECTED",
    createdAt: "2026-03-13T13:50:52.117Z"
  },
  {
    _id: "69b415fcf8a807df391d7be0",
    employeeId: "69b411e6f8a807df391d7b13",
    type: "CASUAL",
    startDate: "2026-03-27",
    endDate: "2026-03-28",
    reason: "Going to visit a temple",
    status: "PENDING",
    createdAt: "2026-03-13T13:49:48.618Z"
  },
  {
    _id: "69b415dff8a807df391d7bdb",
    employeeId: "69b414a7f8a807df391d7b58",
    type: "SICK",
    startDate: "2026-03-15",
    endDate: "2026-03-16",
    reason: "I had a fracture on leg",
    status: "APPROVED",
    createdAt: "2026-03-13T13:49:19.204Z"
  }
];

const initialPayslips = [
  {
    _id: "69b41595f8a807df391d7baa",
    employeeId: "69b411e6f8a807df391d7b13",
    month: 2,
    year: 2026,
    basicSalary: 4000,
    allowances: 400,
    deductions: 80,
    netSalary: 4320,
    createdAt: "2026-03-13T13:48:05.653Z"
  },
  {
    _id: "69b41536f8a807df391d7b9c",
    employeeId: "69b41439f8a807df391d7b52",
    month: 2,
    year: 2026,
    basicSalary: 2000,
    allowances: 150,
    deductions: 20,
    netSalary: 2130,
    createdAt: "2026-03-13T13:46:30.804Z"
  },
  {
    _id: "69b41526f8a807df391d7b98",
    employeeId: "69b414a7f8a807df391d7b58",
    month: 2,
    year: 2026,
    basicSalary: 1000,
    allowances: 100,
    deductions: 9.98,
    netSalary: 1090.02,
    createdAt: "2026-03-13T13:46:14.824Z"
  }
];

const initialAttendance = [
  {
    _id: "69b68d19f4437fdd254d5a68",
    employeeId: "69b411e6f8a807df391d7b13",
    date: "2026-07-03",
    checkIn: "2026-07-03T10:12:00.000Z",
    checkOut: "2026-07-03T18:12:00.000Z",
    status: "PRESENT",
    workingHours: 8,
    dayType: "Full Day"
  },
  {
    _id: "69b415b9f8a807df391d7bcc",
    employeeId: "69b414a7f8a807df391d7b58",
    date: "2026-07-03",
    checkIn: "2026-07-03T09:30:00.000Z",
    checkOut: "2026-07-03T17:30:00.000Z",
    status: "PRESENT",
    workingHours: 8,
    dayType: "Full Day"
  }
];

export const initDb = () => {
  getStorageItem("hrms_users", initialUsers);
  getStorageItem("hrms_employees", initialEmployees);
  getStorageItem("hrms_leaves", initialLeaves);
  getStorageItem("hrms_payslips", initialPayslips);
  getStorageItem("hrms_attendance", initialAttendance);
};

export const getDb = () => {
  initDb();
  return {
    users: JSON.parse(localStorage.getItem("hrms_users")),
    employees: JSON.parse(localStorage.getItem("hrms_employees")),
    leaves: JSON.parse(localStorage.getItem("hrms_leaves")),
    payslips: JSON.parse(localStorage.getItem("hrms_payslips")),
    attendance: JSON.parse(localStorage.getItem("hrms_attendance"))
  };
};

// Login with Login ID instead of Email
export const loginUser = (loginId, password) => {
  const { users } = getDb();
  const user = users.find(u => u.loginId === loginId.toUpperCase() && u.password === password);
  
  if (!user) {
    throw new Error("Invalid Login ID or password.");
  }
  
  return {
    _id: user._id,
    loginId: user.loginId,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    firstLogin: user.firstLogin
  };
};

// Change password after first login
export const changePassword = (userId, newPassword) => {
  const { users } = getDb();
  const updatedUsers = users.map(u => 
    u._id === userId 
      ? { ...u, password: newPassword, tempPassword: null, firstLogin: false }
      : u
  );
  setStorageItem("hrms_users", updatedUsers);
  return { success: true, message: "Password changed successfully" };
};

// Create new user (Admin/HR only)
export const createUserByAdmin = (employeeData) => {
  const { users, employees } = getDb();

  // Validate required fields
  if (!employeeData.firstName || !employeeData.lastName || !employeeData.email) {
    throw new Error("First Name, Last Name, and Email are required.");
  }

  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === employeeData.email.toLowerCase())) {
    throw new Error("Email is already registered.");
  }

  const userId = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  const joinDate = employeeData.joinDate || new Date().toISOString().split('T')[0];
  
  // Generate Login ID
  const loginId = generateLoginId(employeeData.firstName, employeeData.lastName, joinDate);
  
  // Generate Temporary Password
  const tempPassword = generateTempPassword();

  const newUser = {
    _id: userId,
    loginId: loginId,
    email: employeeData.email,
    password: tempPassword,
    tempPassword: tempPassword,
    role: "EMPLOYEE",
    firstName: employeeData.firstName,
    lastName: employeeData.lastName,
    joinDate: joinDate,
    firstLogin: true,
    createdAt: new Date().toISOString()
  };

  const updatedUsers = [...users, newUser];
  setStorageItem("hrms_users", updatedUsers);

  // Create corresponding employee record
  const newEmployee = {
    _id: userId,
    firstName: employeeData.firstName,
    lastName: employeeData.lastName,
    email: employeeData.email,
    phone: employeeData.phone || "—",
    department: employeeData.department,
    position: employeeData.position,
    basicSalary: Number(employeeData.basicSalary) || 0,
    allowances: Number(employeeData.allowances) || 0,
    deductions: Number(employeeData.deductions) || 0,
    employmentStatus: "ACTIVE",
    joinDate: joinDate,
    image: null,
    isDeleted: false,
    bio: "",
    createdAt: new Date().toISOString()
  };

  const updatedEmployees = [...employees, newEmployee];
  setStorageItem("hrms_employees", updatedEmployees);

  return {
    _id: newUser._id,
    loginId: newUser.loginId,
    email: newUser.email,
    role: newUser.role,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    tempPassword: tempPassword,
    firstLogin: true
  };
};

// Keep signupUser for backward compatibility but make it throw error
export const signupUser = (data) => {
  throw new Error("Self-registration is disabled. Please contact HR Administrator to create your account.");
};

export const applyForLeave = (employeeId, leaveData) => {
  const leaves = getStorageItem("hrms_leaves", initialLeaves);
  const newLeave = {
    _id: "leave_" + Math.random().toString(36).substring(2, 9),
    employeeId,
    type: leaveData.type,
    startDate: leaveData.startDate,
    endDate: leaveData.endDate,
    reason: leaveData.reason,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
  const updated = [newLeave, ...leaves];
  setStorageItem("hrms_leaves", updated);
  return newLeave;
};

export const updateLeaveStatus = (leaveId, status) => {
  const leaves = getStorageItem("hrms_leaves", initialLeaves);
  const updated = leaves.map(l => l._id === leaveId ? { ...l, status } : l);
  setStorageItem("hrms_leaves", updated);
};

export const toggleAttendance = (employeeId) => {
  const attendance = getStorageItem("hrms_attendance", initialAttendance);
  const todayStr = new Date().toISOString().split('T')[0];

  // Find checkin for today
  const index = attendance.findIndex(a => a.employeeId === employeeId && a.date === todayStr);

  if (index === -1) {
    // Check in
    const checkInRecord = {
      _id: "att_" + Math.random().toString(36).substring(2, 9),
      employeeId,
      date: todayStr,
      checkIn: new Date().toISOString(),
      checkOut: null,
      status: "PRESENT",
      workingHours: null,
      dayType: "In Progress"
    };
    setStorageItem("hrms_attendance", [checkInRecord, ...attendance]);
    return checkInRecord;
  } else {
    const record = attendance[index];
    if (record.checkOut) {
      // Already checked out today
      return record;
    }
    // Check out
    const checkOutTime = new Date().toISOString();
    const diffMs = new Date(checkOutTime).getTime() - new Date(record.checkIn).getTime();
    const workingHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    let dayType = "Full Day";
    if (workingHours < 4) dayType = "Short Day";
    else if (workingHours < 6) dayType = "Half Day";
    else if (workingHours < 8) dayType = "Three Quarter Day";

    const updatedRecord = {
      ...record,
      checkOut: checkOutTime,
      workingHours,
      dayType
    };

    attendance[index] = updatedRecord;
    setStorageItem("hrms_attendance", attendance);
    return updatedRecord;
  }
};