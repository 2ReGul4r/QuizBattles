import React, { createContext, useReducer, useContext, useEffect } from "react";
import { loginAxios, signupAxios, logoutAxios } from "../services/auth.service";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import validator from "validator";

const initialState = {
  userID: null,
  email: null,
  username: null,
  isAdmin: null,
  loading: true,
};

const actionTypes = {
  SET_USER: "SET_USER",
  LOADING_START: "LOADING_START",
  LOADING_DONE: "LOADING_DONE",
  LOGOUT: "LOGOUT",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        userID: action.payload.userID,
        email: action.payload.email,
        username: action.payload.username,
        isAdmin: action.payload.isAdmin,
        loading: false,
      };
    case actionTypes.LOADING_START:
      return {
        ...state,
        loading: true
      };
    case actionTypes.LOADING_DONE:
      return {
        ...state,
        loading: false
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        userID: null,
        email: null,
        username: null,
        isAdmin: null,
        loading: false
      };
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = Cookies.get("userjwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const {userID, email, isAdmin, username} = decodedToken;
        dispatch({ type: actionTypes.SET_USER, payload: {userID, email, username, isAdmin} });
      } catch (error) {
        console.error("Error while trying to decode UserJWT", error);
        dispatch({ type: actionTypes.LOADING_DONE });
      }
    } else {
      dispatch({ type: actionTypes.LOADING_DONE });
    }
  }, []);

  const handleLogin = async (userdata) => {
    const success = handleInputErrorsLogin(userdata);
		if (!success) return;
    try {
      dispatch({ type: actionTypes.LOADING_START });
      const data = await loginAxios(userdata);
      const {_id, email, isAdmin, username} = data;
      dispatch({ type: actionTypes.SET_USER, payload: {userID: _id, email, username, isAdmin} });
    } catch (error) {
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong, pleas try again later.");
      }
    } finally {
      dispatch({ type: actionTypes.LOADING_DONE });
    }
  };

  const handleSignup = async (userdata) => {
    const success = handleInputErrorsSignUp(userdata);
		if (!success) return;
    try {
      dispatch({ type: actionTypes.LOADING_START });
      const data = await signupAxios(userdata);
      const {_id, email, isAdmin, username} = data;
      dispatch({ type: actionTypes.SET_USER, payload: {userID: _id, email, username, isAdmin} });
    } catch (error) {
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong, pleas try again later.");
      }
    } finally {
      dispatch({ type: actionTypes.LOADING_DONE });
    }
  };

  const handleLogout = async () => {
    dispatch({ type: actionTypes.LOADING_START });
    await logoutAxios();
    dispatch({ type: actionTypes.LOGOUT });
    dispatch({ type: actionTypes.LOADING_DONE });
  };

  return (
    <UserContext.Provider value={{ state, handleLogin, handleSignup, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

function handleInputErrorsLogin({ userIdentifier, password }) {
	if (!userIdentifier || !password) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}

function handleInputErrorsSignUp({ email, username, password, confirmPassword }) {
	if (!email || !username || !password || !confirmPassword) {
		toast.error("Please fill in all fields");
		return false;
	}

  if (!validator.isEmail(email)) {
    toast.error("Email is not valid");
    return false;
}

if (validator.isEmail(username)) {
  toast.error("Username cannot be an email");
    return false;
}

  if (username.length < 3) {
		toast.error("Username must be at least 3 characters");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 8) {
		toast.error("Password must be at least 8 characters");
		return false;
	}

	return true;
}

export const useUser = () => useContext(UserContext);
