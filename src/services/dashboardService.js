import axiosInstance from './axios';

// Get dashboard statistics
export const getDashboardStatistics = async () => {
  try {
    const response = await axiosInstance.get('statistics/overview');
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Get chart data
export const getChartData = async (type, period = 'month') => {
  try {
    const response = await axiosInstance.get('/dashboard/charts', {
      params: { type, period },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get feedback statistics
export const getFeedbackStatistics = async (year = new Date().getFullYear()) => {
  try {
    const response = await axiosInstance.get(`statistics/feedback?year=${year}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get parking spot statistics
export const getParkingRouteStatistics = async (year = new Date().getFullYear()) => {
  try {
    const response = await axiosInstance.get(`statistics/resources?year=${year}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user statistics
export const getUserStatistics = async (year = new Date().getFullYear()) => {
  try {
    const response = await axiosInstance.get(`statistics/user-growth?year=${year}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};