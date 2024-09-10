import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";
import toast from "react-hot-toast";
import Board from "../components/Board";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserXmark } from "@fortawesome/free-solid-svg-icons";

const Game = () => {
  const { activeRoom, gameState, hostState } = useGameContext();
  const { socket, isConnected } = useSocketContext();
  const { userState } = useUser();

  useEffect(() => {
    document.body.addEventListener("keypress", handleKeyPressEvent);
    return () => {
      document.body.removeEventListener("keypress", handleKeyPressEvent);
    }
  }, [])

  const handleKeyPressEvent = (event) => {
    if (event.code === "KeyS") handleOpenScoreBoard();
  }

  const handleOpenScoreBoard = () => {
    const element = document.getElementById("scoreboard-drawer");
    const isChecked = element.checked;
    element.checked = !isChecked;
  }

  const handleKick = (userID) => {
    socket.emit("kickPlayer", userID, activeRoom, (didKick) => {
      if(didKick) {
        toast.success("Player was kicked");
      } else {
        toast.error("Player could not be kicked");
      }
    });
  }

  const handleCopytoClipboard = (value) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard.")
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
      {activeRoom && (<h2 className="absolute top-4 left-4 text-2xl cursor-pointer" onClick={() => handleCopytoClipboard(activeRoom)}>Code: {activeRoom}</h2>)}
      <button className="btn btn-outline btn-error absolute top-4 right-4" onClick={handleLeave}>{(gameState.host.userID === userState.userID) ? "Close game" : "Leave game"}</button>
        <h3 className="card-title self-center pb-4">{gameState.gameState.name} by {gameState.host.username}</h3>
        <Board/>
        <div className="drawer">
          <input id="scoreboard-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
          </div>
          <div className="drawer-side">
            <label htmlFor="scoreboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 overflow-y-auto">
              <li className="mb-4 text-3xl text-primary">Scoreboard</li>
              {Object.entries(gameState.players).map(([key, playerObject]) => (
                <li key={key} className={`${key === gameState?.activePlayer?.userID ? "text-primary" : "" } mb-2 text-base bg-base-300 rounded-lg`}>
                  {playerObject.username}
                  {gameState?.score[key]?.score ? `${gameState.score[key].score}` : ``}
                  {gameState?.score[key]?.money ? `${gameState.score[key].money}$` : ``}
                  {gameState.host.userID === userState.userID && <FontAwesomeIcon icon={faUserXmark} onClick={() => handleKick(key)}/>}
                </li>
              ))}
              {Object.keys(gameState.players).length === 0 && (<li className="text-base text-error">At the moment there are no players.</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game