import axiosInstance from './axios';

// Get all parking lots
export const getAllParkingLots = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/parking-lots', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get parking lot by ID
export const getParkingLotById = async (id) => {
  try {
    const response = await axiosInstance.get(`/parking-lots/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new parking lot
export const createParkingLot = async (data) => {
  try {
    const response = await axiosInstance.post('/parking-lots', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update parking lot
export const updateParkingLot = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/parking-lots/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete parking lot
export const deleteParkingLot = async (id) => {
  try {
    const response = await axiosInstance.delete(`/parking-lots/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get parking statistics
export const getParkingStatistics = async () => {
  try {
    const response = await axiosInstance.get('/parking-lots/statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add new parking type
export const addParkingType = async (typeName) => {
  try {
    const response = await axiosInstance.post('/parking-lots/types', {
      name: typeName,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all parking types
export const getParkingTypes = async () => {
  try {
    const response = await axiosInstance.get('/parking-lots/types');
    return response.data;
  } catch (error) {
    throw error;
  }
};
