import axiosClient from "../../core/api/axiosClient";

export const getAllSchedulesRequest = async (params = {}) => {
  const response = await axiosClient.get("/schedules", {
    params,
  });

  return response.data?.data || [];
};

export const getScheduleByIdRequest = async (scheduleId) => {
  const response = await axiosClient.get(`/schedules/${scheduleId}`);
  return response.data?.data || null;
};

export const createScheduleRequest = async (payload) => {
  const response = await axiosClient.post("/schedules", payload);
  return response.data?.data || null;
};

export const updateScheduleRequest = async (scheduleId, payload) => {
  const response = await axiosClient.patch(`/schedules/${scheduleId}`, payload);
  return response.data?.data || null;
};

export const deleteScheduleRequest = async (scheduleId) => {
  const response = await axiosClient.delete(`/schedules/${scheduleId}`);
  return response.data?.data || null;
};