import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";
import { useSocketContext } from "./SocketContext";

const GameContext = createContext();

export const GameContextProvider = ({ children, lobbyCode, roomState, playersInRoom }) => {
	const { userState } = useUser();
    const { socket, isConnected } = useSocketContext();
    const [activeRoom, setActiveRoom] = useState("");
    const [roomPlayers, setRoomPlayers] = useState({})
    const [host, setHost] = useState("")
    const [gameState, setGameState] = useState({})
    const [hostState, setHostState] = useState({})

    useEffect(() => {
        if (isConnected) {
            socket.on("playersRoomUpdate", (playersOfRoom) => {
                setRoomPlayers(playersOfRoom);
                socket.emit("updateRoomForAll");
            })

            socket.on("gameStateUpdate", (gameState) => {
                setGameState(gameState);
                socket.emit("updateRoomForAll");
            })
        
            socket.on("setHostState", (hostState) => {
                setHostState(hostState);
                socket.emit("updateRoomForAll");
            })

            socket.emit("getGameUpdate", (gameState, playersOfRoom) => {
                setGameState(gameState);
                setRoomPlayers(playersOfRoom);
            })
        }
    }, [isConnected])

    useEffect(() => {
        if (lobbyCode) {
            setActiveRoom(lobbyCode);
            socket.emit("updateRoomForAll");
        }
        if (roomState) {
            setHostState(roomState);
            socket.emit("updateRoomForAll");
        }
        if (playersInRoom) {
            setRoomPlayers(playersInRoom);
            socket.emit("updateRoomForAll");
        }
    }, [lobbyCode, roomState, playersInRoom])

	return (
		<GameContext.Provider value={{ roomPlayers, activeRoom, gameState, hostState }}>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);
