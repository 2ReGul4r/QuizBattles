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
                console.log("setstate")
                setRoomPlayers(playersOfRoom);
            })

            socket.on("updateGameState", (gameState) => {

            })
        
            socket.on("setHostState", (hostState) => {
                setHostState(hostState);
            })
        }
    }, [isConnected])

    useEffect(() => {
        if (lobbyCode) {
            setActiveRoom(lobbyCode);
        }
        if (roomState) {
            setHostState(roomState);
        }
        if (playersInRoom) {
            setRoomPlayers(playersInRoom);
        }
    }, [lobbyCode, roomState, playersInRoom])

	return (
		<GameContext.Provider value={{ roomPlayers, activeRoom, gameState }}>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);
