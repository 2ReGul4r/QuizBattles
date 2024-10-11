import axios from "axios";
import { API_URL } from "./settings.axios";

export const loginAxios = async (userdata) => {
  const response = await axios.post(`${API_URL}/auth/login`, userdata, { withCredentials: true });
  return response.data;
};

export const signupAxios = async (userdata) => {
  const response = await axios.post(`${API_URL}/auth/signup`, userdata, { withCredentials: true });
  return response.data;
};

export const logoutAxios = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  return response.data;
};