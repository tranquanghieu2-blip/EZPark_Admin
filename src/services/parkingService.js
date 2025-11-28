// parkingService.js
import axiosInstance from "./axios";

// Get all parking spots with pagination
export const getAllParkingSpots = async ({
  pageNumber,
  pageSize = 10,
  query = "",
}) => {
  try {
    const response = await axiosInstance.get("parking-spots/list", {
      params: { pageNumber, pageSize, query }
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
    const response = await axiosInstance.delete(`/parking-spots/delete/${id}`, {
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
    const response = await axiosInstance.get(`parking-spots/add/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new parking spot
export const createParkingSpot = async (data) => {
  try {
    const response = await axiosInstance.post("parking-spots/add", data);
    return response.data;
  } catch (error) {
    throw error;
    console.log("Errpr creating parking spot:", error);
  }
};

// Update parking spot
export const updateParkingSpot = async (id, data) => {
  try {
    const response = await axiosInstance.put(`parking-spots/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
