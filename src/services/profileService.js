import axiosInstance from './axios';
import { STORAGE_KEYS } from '../constants';

// Update profile
export const updateProfile = async (data) => {
  try {
    const response = await axiosInstance.put('/auth/profile', data);
    
    // Cập nhật thông tin user trong localStorage
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    const updatedUser = { ...currentUser, ...response.data.user };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update avatar
export const updateAvatar = async (formData) => {
  try {
    const response = await axiosInstance.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Cập nhật avatar trong localStorage
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    const updatedUser = { ...currentUser, avatar: response.data.avatar };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    
    return response.data;
  } catch (error) {
    throw error;
  }
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

// Get profile
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};
