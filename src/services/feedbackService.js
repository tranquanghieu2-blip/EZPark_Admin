import axiosInstance from './axios';

// Get all feedback
export const getAllFeedback = async ({
  pageNumber = 1,
  pageSize = 10,
  query = "",
} = {}) => {
  try {
    const response = await axiosInstance.get('feedbacks/list', {
      params: { pageNumber, pageSize, query }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Get feedback by parking lot ID
export const getFeedbackByID = async (feedbackId) => {
  try {
    const response = await axiosInstance.get(`feedbacks/${feedbackId}`);
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
    const response = await axiosInstance.delete(`/feedbacks/${id}`);
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
