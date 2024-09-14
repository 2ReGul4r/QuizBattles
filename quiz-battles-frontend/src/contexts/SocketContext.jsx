import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "./UserContext";
import io from "socket.io-client";
import Cookies from "js-cookie";
import handleSocketErrors from "../utils/SocketErrorEventHandler";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const { userState } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (userState.userID) {
			const token = Cookies.get("userjwt");
			const socket = io("http://localhost:5000/", {
				auth: {token: token},
			});

			socket.on("redirectToRoom", async (roomID, callback) => {
				await navigate("/game", { state: { roomID }});
				callback();
			})

			socket.on("redirectToHome", async () => {
				await navigate("/");
			})

			handleSocketErrors(socket);
			setSocket(socket);
			setIsConnected(true);

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
				setIsConnected(false);
			}
		}
	}, [userState]);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocketContext = () => useContext(SocketContext);
