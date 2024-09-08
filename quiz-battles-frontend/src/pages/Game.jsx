import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import toast from "react-hot-toast";

const Game = () => {
  const { activeRoom, gameState, hostState } = useGameContext();
  const { socket, isConnected } = useSocketContext();

  useEffect(() => {
  }, [gameState])

  const handleKick = (userID) => {
    socket.emit("kickPlayer", userID, activeRoom, (didKick) => {
      if(didKick) {
        toast.success("Player was kicked");
      } else {
        toast.error("Player could not be kicked");
      }
    });
  }

  const handleLeave = () => {
    socket.emit("leaveGame", activeRoom);
  }

  if (Object.keys(gameState) <= 0) {
    return (
        <div className="flex flex-col items-center justify-center m-16">
            <p className="text-2xl mb-4">Loading...</p>
            <progress className="progress progress-primary w-96" />
        </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl items-center text-center basis-full">
      <div className="card-body w-full">
        {Object.keys(hostState).length > 0 && (<h2 className="card-title self-center pb-4">Lobbycode: {activeRoom}</h2>)}
        <h3 className="card-title self-center pb-4">{gameState.gameState.name} by {gameState.host.username}</h3>
        <div className="card-actions flex-row">
          <div className="flex w-full justify-start flex-wrap">
            {Object.entries(gameState.players).map(([key, playerObject]) => (
            <div key={key} className="mr-4 mb-4">
              <div className={`badge badge-outline max-w-32 overflow-clip ${key === gameState?.activePlayer?.userID ? "badge-primary" : "" }`}>
                {playerObject.username}
              </div>
              {Object.keys(hostState).length > 0 && (<button className="btn btn-outline btn-sm btn-error ml-2" onClick={() => handleKick(key)}>Kick</button>)}
            </div>
          ))}
          </div>
        </div>
        <div className="card-actions flex-row">
          <div className="flex w-full justify-end flex-wrap flex-grow">
            <button className="btn btn-outline btn-error" onClick={handleLeave}>{(Object.keys(hostState).length > 0) ? "Delete game" : "Leave game"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game