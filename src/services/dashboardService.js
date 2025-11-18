import axiosInstance from './axios';

// Get dashboard statistics
export const getDashboardStatistics = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get recent activities
export const getRecentActivities = async (limit = 10) => {
  try {
    const response = await axiosInstance.get('/dashboard/activities', {
      params: { limit },
    });
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
