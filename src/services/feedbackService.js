import axiosInstance from './axios';

// Get all feedback
export const getAllFeedback = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/feedback', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get feedback by parking lot ID
export const getFeedbackByParkingLot = async (parkingLotId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/feedback/parking-lot/${parkingLotId}`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get feedback by ID
export const getFeedbackById = async (id) => {
  try {
    const response = await axiosInstance.get(`/feedback/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete feedback
export const deleteFeedback = async (id) => {
  try {
    const response = await axiosInstance.delete(`/feedback/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check inappropriate content
export const checkInappropriateContent = async (text) => {
  try {
    const response = await axiosInstance.post('/feedback/check-content', {
      text,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get feedback statistics
export const getFeedbackStatistics = async () => {
  try {
    const response = await axiosInstance.get('/feedback/statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};
