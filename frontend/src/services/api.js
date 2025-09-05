import axios from 'axios';

// Base API configuration
const USER_MANAGEMENT_API_URL = process.env.REACT_APP_USER_API_URL || 'http://localhost:5245/api';
const TRANSLATION_API_URL = process.env.REACT_APP_TRANSLATE_API_URL || 'http://localhost:5000/api';

// Create separate API instances for different services
const userAPI_instance = axios.create({
  baseURL: USER_MANAGEMENT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const translationAPI_instance = axios.create({
  baseURL: TRANSLATION_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls - using UserManagementSystem
export const authAPI = {
  login: (email, password) =>
    userAPI_instance.post('/auth/login', { Username: email, Password: password }),

  register: (username, email, password, role = 'User') =>
    userAPI_instance.post('/auth/register', { Username: username, Email: email, Password: password, Role: role }),

  fastLogin: (role) =>
    userAPI_instance.post('/auth/fast-login', { UserType: role }),

  verify: () =>
    userAPI_instance.get('/auth/verify'),

  refreshToken: () =>
    userAPI_instance.post('/auth/refresh'),
};

// User management API calls - using UserManagementSystem
export const userAPI = {
  // Get all users (Admin only)
  getAllUsers: () =>
    userAPI_instance.get('/users'),

  // Get user by ID
  getUserById: (id) =>
    userAPI_instance.get(`/users/${id}`),

  // Update user
  updateUser: (id, userData) =>
    userAPI_instance.put(`/users/${id}`, userData),

  // Delete user (Admin only)
  deleteUser: (id) =>
    userAPI_instance.delete(`/users/${id}`),

  // Create user (Admin only) - using register endpoint
  createUser: (userData) =>
    userAPI_instance.post('/auth/register', { 
      Username: userData.username, 
      Email: userData.email, 
      Password: userData.password, 
      Role: userData.role 
    }),

  // Get current user profile
  getProfile: () =>
    userAPI_instance.get('/users/profile'),

  // Update current user profile
  updateProfile: (userData, userId) =>
    userAPI_instance.put(`/users/${userId}`, userData),

  // Change password
  changePassword: (oldPassword, newPassword, userId) =>
    userAPI_instance.put(`/users/${userId}`, { Password: newPassword }),
};

// Translation API calls - using Backend
export const translationAPI = {
  // Get available languages
  getLanguages: () =>
    translationAPI_instance.get('/languages'),

  // Translate text
  translate: (sourceText, sourceLang, targetLang) =>
    translationAPI_instance.post('/translate', { sourceText, sourceLang, targetLang }),

  // Get translation history (if needed)
  getHistory: () =>
    translationAPI_instance.get('/translate/history'),
};

// Generic API error handler
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request';
      case 401:
        return 'Unauthorized - Please login again';
      case 403:
        return 'Access forbidden - Insufficient permissions';
      case 404:
        return 'Resource not found';
      case 409:
        return data.message || 'Conflict - Resource already exists';
      case 422:
        return data.message || 'Validation error';
      case 500:
        return 'Internal server error';
      default:
        return data.message || `Error ${status}: ${error.response.statusText}`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error - Cannot connect to server';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

// Request interceptor to add authentication token
userAPI_instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for common error handling
userAPI_instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = handleAPIError(error);
    console.error('User API Error:', errorMessage);
    return Promise.reject(error);
  }
);

translationAPI_instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = handleAPIError(error);
    console.error('Translation API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export default { userAPI_instance, translationAPI_instance };