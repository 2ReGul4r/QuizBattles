import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";
import { useSocketContext } from "./SocketContext";
import { useNavigate } from "react-router-dom";

const GameContext = createContext();

export const GameContextProvider = ({ children, roomID, roomState }) => {
	const { userState } = useUser();
    const { socket, isConnected } = useSocketContext();
    const [activeRoom, setActiveRoom] = useState("");
    const [host, setHost] = useState("")
    const [gameState, setGameState] = useState({})
    const [hostState, setHostState] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        if (!isConnected) return
        if (roomID) {
            setActiveRoom(roomID);
        }
        if (roomState) {
            setHostState(roomState);
        }
    }, [roomID, roomState])

    useEffect(() => {
        if (!isConnected) {
            return
        }
        if (activeRoom) {
            socket.emit("isRoomExisting", activeRoom);
        }
        socket.on("setHostState", (hostState) => {
            setHostState(hostState);
            socket.emit("updateRoomForAll");
        });

        socket.on("gameStateUpdate", (gameState) => {
            setGameState(gameState);
        });
        // socket.on("playersRoomUpdate", (playersOfRoom) => {
        //     setRoomPlayers(playersOfRoom);
        //     socket.emit("updateRoomForAll");
        // });

        // socket.emit("getGameUpdate", (gameState, playersOfRoom) => {
        //     setGameState(gameState);
        //     setRoomPlayers(playersOfRoom);
        // });
    }, [isConnected])

	return (
		<GameContext.Provider value={{ activeRoom, gameState, hostState }}>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);
