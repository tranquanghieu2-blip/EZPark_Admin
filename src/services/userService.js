import axiosInstance from './axios';

// Get all users
export const getAllUsers = async ({
  pageNumber = 1,
  pageSize = 10,
  query = "",
}) => {
  try {
    const response = await axiosInstance.get('users/list', {
      params: { pageNumber, pageSize, query }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);  
    return response.data;
  } catch (error) {
    throw error;
  } 
};

