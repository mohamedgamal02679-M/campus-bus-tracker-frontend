import axiosClient from "../../core/api/axiosClient";

export const getAllStopsRequest = async (params = {}) => {
  const response = await axiosClient.get("/stops", {
    params,
  });

  return response.data?.data || [];
};

export const getStopByIdRequest = async (stopId) => {
  const response = await axiosClient.get(`/stops/${stopId}`);
  return response.data?.data || null;
};

export const createStopRequest = async (payload) => {
  const response = await axiosClient.post("/stops", payload);
  return response.data?.data || null;
};

export const updateStopRequest = async (stopId, payload) => {
  const response = await axiosClient.patch(`/stops/${stopId}`, payload);
  return response.data?.data || null;
};

export const deleteStopRequest = async (stopId) => {
  const response = await axiosClient.delete(`/stops/${stopId}`);
  return response.data?.data || null;
};