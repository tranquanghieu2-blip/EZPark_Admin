import axiosInstance from './axios';

// Get all restricted zones
export const getAllRestrictedZones = async ({
  pageNumber,
  pageSize = 10,
  query = "",
}) => {
  try {
    const response = await axiosInstance.get("no-parking-routes/list", {
      params: { pageNumber, pageSize, query }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching restricted zones:", error);
    throw error;
  }
};

// Get restricted zone by ID
export const getRestrictedZoneById = async (id) => {
  try {
    const response = await axiosInstance.get(`/no-parking-routes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new restricted zone
export const createRestrictedZone = async (data) => {
  try {
    console.log("Creating restricted zone with data:", data);
    const response = await axiosInstance.post('/no-parking-routes', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update restricted zone
export const updateRestrictedZone = async (id, data) => {
  try {
    console.log("Updating restricted zone with data:", data);
    const response = await axiosInstance.put(`/no-parking-routes/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete restricted zone
export const deleteRestrictedZone = async (id) => {
  try {
    const response = await axiosInstance.delete(`/no-parking-routes/${id}`);
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
