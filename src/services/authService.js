import axiosInstance from './axios';
import { STORAGE_KEYS } from '../constants';

// Login
export const login = async (username, password) => {
  try {
    // Mock login - tự động đăng nhập thành công
    const mockResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        name: 'Admin',
        username: username || 'admin',
        email: 'admin@ezpark.com',
        role: 'Administrator',
      },
    };
    
    // Lưu token và thông tin user vào localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, mockResponse.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockResponse.user));
    
    return mockResponse;
    
    // Khi có API thực, uncomment code dưới và xóa mock code trên
    /*
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    
    return response.data;
    */
  } catch (error) {
    throw error;
  }
};

// Auto login for development
export const autoLogin = () => {
  const mockUser = {
    id: 1,
    name: 'Admin',
    username: 'admin',
    email: 'admin@ezpark.com',
    role: 'Administrator',
  };
  
  localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-auto-' + Date.now());
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
};

// Logout
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// Change password
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axiosInstance.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await axiosInstance.get('/auth/verify');
    return response.data;
  } catch (error) {
    throw error;
  }
};
