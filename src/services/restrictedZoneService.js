import axiosInstance from './axios';

// Get all restricted zones
export const getAllRestrictedZones = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/restricted-zones', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get restricted zone by ID
export const getRestrictedZoneById = async (id) => {
  try {
    const response = await axiosInstance.get(`/restricted-zones/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new restricted zone
export const createRestrictedZone = async (data) => {
  try {
    const response = await axiosInstance.post('/restricted-zones', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update restricted zone
export const updateRestrictedZone = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/restricted-zones/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete restricted zone
export const deleteRestrictedZone = async (id) => {
  try {
    const response = await axiosInstance.delete(`/restricted-zones/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get restricted zone statistics
export const getRestrictedZoneStatistics = async () => {
  try {
    const response = await axiosInstance.get('/restricted-zones/statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};
