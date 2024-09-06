import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Lobby from "../components/Lobby";
import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";

const Game = () => {
  const { roomPlayers, activeRoom, gameState } = useGameContext();
  const { socket, isConnected } = useSocketContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket || !activeRoom) return;
    socket.emit("checkForRoomExistence", activeRoom, (existingRoom) => {
      if(!existingRoom) {
        navigate("/");
      }
    })
  }, [roomPlayers, activeRoom, gameState])


  return (
    <Lobby />
  )
}

export default Game