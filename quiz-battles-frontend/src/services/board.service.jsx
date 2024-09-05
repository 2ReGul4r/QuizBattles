import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

export const createBoard = async () => {
  const response = await axios.post(`${API_URL}/board/create`, {} , { withCredentials: true});
  toast.success("QuizBattle was created.")
  return response.data;
}

export const saveBoard = async (state) => {
  const response = await axios.post(`${API_URL}/board/save`, state, { withCredentials: true});
  toast.success("QuizBattle was saved.")
  return response.data;
};

export const getBoards = async () => {
  const response = await axios.get(`${API_URL}/board/get`, { withCredentials: true});
  return response.data;
}

export const readBoard = async (boardID) => {
  const response = await axios.get(`${API_URL}/board/read`, { params: { boardID }, withCredentials: true});
  return response.data;
}

export const deleteBoard = async (boardID) => {
  const response = await axios.post(`${API_URL}/board/delete`, {boardID}, { withCredentials: true});
  return response.data;
}