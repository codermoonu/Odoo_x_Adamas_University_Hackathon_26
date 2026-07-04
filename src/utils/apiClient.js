// frontend/src/utils/apiClient.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Helper to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Generic API request handler
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    // Handle unauthorized (token expired)
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }

    return {
      success: response.ok,
      status: response.status,
      data: result,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      status: 500,
      data: { message: error.message },
    };
  }
};

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * Login user with Login ID
 * @param {string} loginId - User's Login ID (e.g., OIJODO20220001)
 * @param {string} password - User's password
 */
export const loginUser = async (loginId, password) => {
  try {
    const response = await apiRequest('/auth/login', 'POST', {
      loginId,
      password,
    });

    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    throw new Error('Login failed. Please try again.');
  }
};

/**
 * Change password on first login
 * @param {string} userId - User ID
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm password
 */
export const changePassword = async (userId, newPassword, confirmPassword) => {
  try {
    const response = await apiRequest('/auth/change-password', 'POST', {
      userId,
      newPassword,
      confirmPassword,
    });

    return response.data;
  } catch (error) {
    throw new Error('Password change failed. Please try again.');
  }
};

/**
 * Create new employee (Admin only)
 * @param {object} employeeData - Employee details
 */
export const createEmployee = async (employeeData) => {
  try {
    const response = await apiRequest('/auth/create-employee', 'POST', employeeData);

    if (!response.success) {
      throw new Error(response.data.message || 'Failed to create employee');
    }

    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Employee creation failed');
  }
};

/**
 * Get user profile
 * @param {string} userId - User ID
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await apiRequest(`/auth/profile/${userId}`, 'GET');

    if (!response.success) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }

    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch profile');
  }
};

/**
 * Get employee profile
 * @param {string} employeeId - Employee ID
 */
export const getEmployeeProfile = async (employeeId) => {
  try {
    const response = await apiRequest(`/auth/employee/${employeeId}`, 'GET');

    if (!response.success) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }

    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch profile');
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  removeAuthToken();
};

/**
 * Get stored auth token
 */
export const getStoredToken = () => {
  return getAuthToken();
};

export default {
  loginUser,
  changePassword,
  createEmployee,
  getUserProfile,
  getEmployeeProfile,
  logoutUser,
  getStoredToken,
};