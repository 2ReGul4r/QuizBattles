import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";
import { useSocketContext } from "./SocketContext";
import { useNavigate } from "react-router-dom";

const GameContext = createContext();

export const GameContextProvider = ({ children, roomID, roomState }) => {
	const { userState } = useUser();
    const { socket, isConnected } = useSocketContext();
    const [activeRoom, setActiveRoom] = useState("");
    const [gameState, setGameState] = useState({});
    const [markedQuestion, setMarkedQuestion] = useState(-1);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(-1);

    useEffect(() => {
        if (!isConnected) return
        if (roomID) {
            setActiveRoom(roomID);
        }
    }, [roomID, roomState])

    useEffect(() => {
        if (!isConnected) {
            return
        }
        if (!activeRoom) {
            //socket.emit("tryToReconnect");
        }
        socket.on("gameStateUpdate", (gameState) => {
            setGameState(gameState);
        });
        socket.on("markedQuestion", (markedQuestionIndex) => {
            setMarkedQuestion(markedQuestionIndex);
        })
    }, [isConnected])

	return (
		<GameContext.Provider value={{ activeRoom, gameState, markedQuestion, activeQuestionIndex, setActiveQuestionIndex }}>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);
