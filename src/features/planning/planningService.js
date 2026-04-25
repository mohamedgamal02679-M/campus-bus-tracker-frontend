import axiosClient from "../../core/api/axiosClient";

export const planTripRequest = async (payload) => {
  const response = await axiosClient.post("/planning/trip", payload);
  return response.data?.data || null;
};