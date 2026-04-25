import axiosClient from "../../core/api/axiosClient";

export const getAllOperationLogsRequest = async (params = {}) => {
  const response = await axiosClient.get("/operation-logs", {
    params,
  });

  return response.data?.data || [];
};

export const getOperationLogByIdRequest = async (logId) => {
  const response = await axiosClient.get(`/operation-logs/${logId}`);
  return response.data?.data || null;
};