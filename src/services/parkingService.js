// parkingService.js
import axiosInstance from "./axios";

// Get all parking spots with pagination
export const getAllParkingSpots = async ({
  pageNumber = 1,
  pageSize = 10,
  search = "",
}) => {
  try {
    const response = await axiosInstance.get("parking-spots/list", {
      params: { pageNumber, pageSize }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching parking spots:", error);
    throw error;
  }
};

// Delete parking spot
export const deleteParkingSpot = async (id) => {
  try {
    const response = await axiosInstance.delete(`/parking-spots/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get parking spot by ID
export const getParkingSpotById = async (id) => {
  try {
    const response = await axiosInstance.get(`/parking-spots/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new parking spot
export const createParkingSpot = async (data) => {
  try {
    const response = await axiosInstance.post("/parking-spots", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update parking spot
export const updateParkingSpot = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/parking-spots/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
