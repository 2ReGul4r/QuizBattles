import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const loginAxios = async (userdata) => {
  const response = await axios.post(`${API_URL}/auth/login`, userdata, { withCredentials: true });
  return response.data;
};

export const signupAxios = async (userdata) => {
  const response = await axios.post(`${API_URL}/auth/signup`, userdata);
  return response.data;
};

export const logoutAxios = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  return response.data;
};