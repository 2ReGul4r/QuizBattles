import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";
import { useSocketContext } from "./SocketContext";
import { useNavigate } from "react-router-dom";

const GameContext = createContext();

export const GameContextProvider = ({ children, roomID, roomState }) => {
	const { userState } = useUser();
    const { socket, isConnected } = useSocketContext();
    const [activeRoom, setActiveRoom] = useState("");
    const [gameState, setGameState] = useState({})
    const [hostState, setHostState] = useState({})
    const [markedQuestion, setMarkedQuestion] = useState(-1)

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
        if (!activeRoom) {
            //socket.emit("tryToReconnect");
        }
        socket.on("setHostState", (hostState) => {
            setHostState(hostState);
            socket.emit("updateRoomForAll");
        });
        socket.on("gameStateUpdate", (gameState) => {
            setGameState(gameState);
        });
        socket.on("markedQuestion", (markedQuestionIndex) => {
            setMarkedQuestion(markedQuestionIndex);
        })
    }, [isConnected])

	return (
		<GameContext.Provider value={{ activeRoom, gameState, hostState, markedQuestion }}>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);
