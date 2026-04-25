import axiosClient from "../../core/api/axiosClient";

export const getMyFavoritesRequest = async (params = {}) => {
  const response = await axiosClient.get("/favorites/me", {
    params,
  });

  return response.data?.data || [];
};

export const addFavoriteRequest = async (payload) => {
  const response = await axiosClient.post("/favorites", payload);
  return response.data?.data || null;
};

export const removeFavoriteRequest = async (favoriteId) => {
  const response = await axiosClient.delete(`/favorites/${favoriteId}`);
  return response.data?.data || null;
};