import axiosClient from "../../core/api/axiosClient";

export const getAllRoutesRequest = async (params = {}) => {
  const response = await axiosClient.get("/routes", {
    params,
  });

  return response.data?.data || [];
};

export const getRouteByIdRequest = async (routeId) => {
  const response = await axiosClient.get(`/routes/${routeId}`);
  return response.data?.data || null;
};

export const createRouteRequest = async (payload) => {
  const response = await axiosClient.post("/routes", payload);
  return response.data?.data || null;
};

export const updateRouteRequest = async (routeId, payload) => {
  const response = await axiosClient.patch(`/routes/${routeId}`, payload);
  return response.data?.data || null;
};

export const deleteRouteRequest = async (routeId) => {
  const response = await axiosClient.delete(`/routes/${routeId}`);
  return response.data?.data || null;
};