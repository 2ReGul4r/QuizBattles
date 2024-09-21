import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process?.env?.API_URL || "http://localhost:5000/api";

export const createQuizBattle = async () => {
  const response = await axios.post(`${API_URL}/quizbattle/create`, {} , { withCredentials: true});
  toast.success("QuizBattle was created.")
  return response.data;
}

export const saveQuizBattle = async (state) => {
  const response = await axios.post(`${API_URL}/quizbattle/save`, state, { withCredentials: true});
  toast.success("QuizBattle was saved.")
  return response.data;
};

export const getQuizBattles = async () => {
  const response = await axios.get(`${API_URL}/quizbattle/get`, { withCredentials: true});
  return response.data;
}

export const readQuizBattle = async (quizbattleID) => {
  const response = await axios.get(`${API_URL}/quizbattle/read`, { params: { quizbattleID }, withCredentials: true});
  return response.data;
}

export const deleteQuizBattle = async (quizbattleID) => {
  const response = await axios.post(`${API_URL}/quizbattle/delete`, {quizbattleID}, { withCredentials: true});
  return response.data;
}