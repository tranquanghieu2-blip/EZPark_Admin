import axiosInstance from './axios';

// Get all users
export const getAllUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new user
export const createUser = async (data) => {
  try {
    const response = await axiosInstance.post('/users', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user
export const updateUser = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Block/Unblock user
export const toggleUserStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/users/${id}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user statistics
export const getUserStatistics = async () => {
  try {
    const response = await axiosInstance.get('/users/statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};
