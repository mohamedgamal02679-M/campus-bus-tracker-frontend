import axiosClient from "../../core/api/axiosClient";

export const getAllAnnouncementsRequest = async (params = {}) => {
  const response = await axiosClient.get("/announcements", {
    params,
  });

  return response.data?.data || [];
};

export const getAnnouncementByIdRequest = async (announcementId) => {
  const response = await axiosClient.get(`/announcements/${announcementId}`);
  return response.data?.data || null;
};