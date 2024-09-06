import { useEffect } from "react";
import { useGameContext } from "../contexts/GameContext";

const Lobby = () => {
    const { roomPlayers, activeRoom, gameState } = useGameContext();

    return (
        <div className="card bg-base-200 shadow-xl items-center text-center basis-full">
            <div className="card-body w-full">
                <h2 className="card-title self-center pb-4">Lobbycode: {activeRoom}</h2>
                <h3 className="card-title self-center pb-4">Host:</h3>
                
                <ul>
                    {Object.entries(roomPlayers).map(([key, playerObject]) => (
                        <li key={key}>{playerObject.username}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
  
export default Lobby