import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const saveBoard = async (state) => {
  const response = await axios.post(`${API_URL}/board/save`, state, { withCredentials: true});
  console.log(response);
  return response.data;
};