import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "./UserContext";
import io from "socket.io-client";
import Cookies from "js-cookie";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [playerGameState, setplayerGameState] = useState({});
	const { userState } = useUser();

	useEffect(() => {
		if (userState.userID) {
			const token = Cookies.get("userjwt");
			const socket = io("http://localhost:5000/", {
				auth: {token: token},
			});

			setSocket(socket);

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [userState]);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocketContext = () => useContext(SocketContext);
