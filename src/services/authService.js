import axiosInstance from './axios';
import { STORAGE_KEYS } from '../constants';

// Login
export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post(
      '/admin/login',
      { username, password },
      { withCredentials: true }
    );

    if (response.data.success && response.data.admin) {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.admin));
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data?.message || error.message);
    throw error;
  }
};


// Logout
export const logout = async () => {
  try {
    // Gọi API logout để xóa cookie từ server
    await axiosInstance.post('/admin/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Xóa thông tin user khỏi sessionStorage
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// Get current user
export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
// Kiểm tra xem có thông tin user trong session không
export const isAuthenticated = () => {
  return !!sessionStorage.getItem(STORAGE_KEYS.USER);
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
