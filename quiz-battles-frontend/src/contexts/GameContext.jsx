import { createContext, useState, useContext, useEffect } from "react";
import { useSocketContext } from "./SocketContext";

const GameContext = createContext();

export const GameContextProvider = ({ children, roomID }) => {
    const { socket, isConnected } = useSocketContext();
    const [activeRoom, setActiveRoom] = useState("");
    const [gameState, setGameState] = useState({});
    const [hostState, setHostState] = useState({});
    const [roomState, setRoomState] = useState({});
    const [markedQuestion, setMarkedQuestion] = useState(-1);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(-1);

    useEffect(() => {
        if (!isConnected) return
        if (roomID) {
            setActiveRoom(roomID);
        }
    }, [roomID])

    useEffect(() => {
        if (!isConnected) {
            return
        }
        socket.on("hostStateUpdate", (hostState) => {
            setHostState(hostState);
        });
        socket.on("gameStateUpdate", (gameState) => {
            setGameState(gameState);
        });
        socket.on("setRoomState", (roomState) => {
            setRoomState(roomState);
        })
        socket.on("markedQuestion", (markedQuestionIndex) => {
            setMarkedQuestion(markedQuestionIndex);
        });
    }, [isConnected])

    return (
        <GameContext.Provider value={{ activeRoom, gameState, hostState, roomState, markedQuestion, activeQuestionIndex, setActiveQuestionIndex }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => useContext(GameContext);
