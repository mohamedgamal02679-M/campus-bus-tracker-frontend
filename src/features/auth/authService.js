import axiosClient from "../../core/api/axiosClient";
import {
  clearAuthStorage,
  getToken,
  getUser,
  setToken,
  setUser,
} from "../../core/auth/tokenStorage";

export const registerRequest = async (payload) => {
  const response = await axiosClient.post("/auth/register", payload);
  const result = response.data;

  const token = result?.data?.token;
  const user = result?.data?.user;

  if (token) {
    setToken(token);
  }

  if (user) {
    setUser(user);
  }

  return result;
};

export const loginRequest = async (payload) => {
  const response = await axiosClient.post("/auth/login", payload);
  const result = response.data;

  const token = result?.data?.token;
  const user = result?.data?.user;

  if (token) {
    setToken(token);
  }

  if (user) {
    setUser(user);
  }

  return result;
};

export const getCurrentUserRequest = async () => {
  const token = getToken();

  if (!token) {
    return null;
  }

  const response = await axiosClient.get("/auth/me");
  const user = response.data?.data || null;

  if (user) {
    setUser(user);
  }

  return user;
};

export const logout = () => {
  clearAuthStorage();
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

export const getStoredUser = () => {
  return getUser();
};