import axiosClient from "../../core/api/axiosClient";

export const getAdminAnnouncementsRequest = async (params = {}) => {
  const response = await axiosClient.get("/announcements", {
    params,
  });

  return response.data?.data || [];
};

export const getAdminAnnouncementByIdRequest = async (announcementId) => {
  const response = await axiosClient.get(`/announcements/${announcementId}`);
  return response.data?.data || null;
};

export const createAdminAnnouncementRequest = async (payload) => {
  const response = await axiosClient.post("/announcements", payload);
  return response.data?.data || null;
};

export const updateAdminAnnouncementRequest = async (
  announcementId,
  payload
) => {
  const response = await axiosClient.patch(
    `/announcements/${announcementId}`,
    payload
  );

  return response.data?.data || null;
};

export const deleteAdminAnnouncementRequest = async (announcementId) => {
  const response = await axiosClient.delete(`/announcements/${announcementId}`);
  return response.data?.data || null;
};