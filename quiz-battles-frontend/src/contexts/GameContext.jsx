import { createContext, useState, useContext, useEffect } from "react";
import { useSocketContext } from "./SocketContext";

const GameContext = createContext();

export const GameContextProvider = ({ children, roomID, roomState }) => {
    const { socket, isConnected } = useSocketContext();
    const [activeRoom, setActiveRoom] = useState("");
    const [gameState, setGameState] = useState({});
    const [hostState, setHostState] = useState({});
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
        socket.on("hostStateUpdate", (hostState) => {
            setHostState(hostState);
        });
        socket.on("gameStateUpdate", (gameState) => {
            setGameState(gameState);
            console.log(gameState);
        });
        socket.on("markedQuestion", (markedQuestionIndex) => {
            setMarkedQuestion(markedQuestionIndex);
        });
    }, [isConnected])

	return (
		<GameContext.Provider value={{ activeRoom, gameState, hostState, markedQuestion, activeQuestionIndex, setActiveQuestionIndex }}>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);
