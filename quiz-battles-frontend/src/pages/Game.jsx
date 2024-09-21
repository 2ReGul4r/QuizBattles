import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";
import toast from "react-hot-toast";
import Board from "../components/Board";
import QuestionAnswerScreen from "../components/QuestionAnswerScreen";
import GameOverScreen from "../components/GameOverScreen";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserXmark } from "@fortawesome/free-solid-svg-icons";

const Game = () => {
  const { activeRoom, gameState } = useGameContext();
  const { socket } = useSocketContext();
  const { userState } = useUser();

  useEffect(() => {
    document.body.addEventListener("keypress", handleKeyPressEvent);
    return () => {
      document.body.removeEventListener("keypress", handleKeyPressEvent);
    }
  }, []);

  const handleKeyPressEvent = (event) => {
    if (event.code === "KeyS") handleOpenScoreBoard();
  };

  const handleOpenScoreBoard = () => {
    const element = document.getElementById("scoreboard-drawer");
    const isChecked = element.checked;
    element.checked = !isChecked;
  };

  const handleKick = (userID) => {
    socket.emit("kickPlayer", userID, activeRoom, (didKick) => {
      if(didKick) {
        toast.success("Player was kicked");
      } else {
        toast.error("Player could not be kicked");
      }
    });
  };

  const handleCopytoClipboard = (value) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard.")
  };

  const handleLeave = () => {
    socket.emit("leaveGame", activeRoom);
  };

  const isGameOver = () => {
    return gameState.questionsAnsweredCount >= (gameState.gameState.options.quiz.categoryCount * gameState.gameState.options.quiz.questionsPerCategory)
  };

  if (!Object.keys(gameState).length) {
    return (
        <div className="flex flex-col items-center justify-center m-16">
            <p className="text-2xl mb-4">Loading...</p>
            <progress className="progress progress-primary w-96" />
        </div>
    );
  }

  return (
    <div>
      <div className={`card bg-base-200 shadow-xl items-center text-center basis-full ${gameState?.activePlayer?.userID === userState.userID && (!Object.keys(gameState.activeQuestion).length && !Object.keys(gameState.activeAnswer).length) && !isGameOver() && "marked-question-border"}`}>
        <div className="card-body w-full">
        {activeRoom && (<h2 className="absolute top-4 left-4 text-2xl cursor-pointer" onClick={() => handleCopytoClipboard(activeRoom)}>Code: {activeRoom}</h2>)}
        <button className="btn btn-outline btn-error absolute top-4 right-4" onClick={handleLeave}>{(gameState.host.userID === userState.userID) ? "Close game" : "Leave game"}</button>
          <h3 className="card-title self-center pb-4">{gameState.gameState.name} by {gameState.host.username}</h3>
          {
            isGameOver() ? <GameOverScreen/>
            : (!Object.keys(gameState.activeQuestion).length && !Object.keys(gameState.activeAnswer).length)
              ? <Board/>
              : <QuestionAnswerScreen/>
          }

        </div>
      </div>
      <div className="drawer">
        <input id="scoreboard-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-side">
            <label htmlFor="scoreboard-drawer" aria-label="close scoreboard" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 overflow-y-auto">
              <li className="mb-4 text-3xl self-center">Scoreboard</li>
              {Object.entries(gameState.players).map(([userID, playerObject]) => (
                <li key={userID} className={`${userID === gameState?.activePlayer?.userID ? "text-primary" : "" } mb-2 text-base bg-base-300 rounded-lg`}>
                  <h3 className="text-lg font-semibold self-center btn-disabled">{playerObject.username}</h3>
                  {typeof gameState?.score[userID]?.score === "number" && (<p className="text-lg self-center font-medium btn-disabled">{gameState.score[userID].score}</p>)}
                  {gameState.host.userID === userState.userID && <FontAwesomeIcon className="p-2 w-4 h-4 absolute self-end" icon={faUserXmark} onClick={() => handleKick(userID)}/>}
                </li>
              ))}
              {Object.keys(gameState.players).length === 0 && (<li className="text-base text-error">At the moment there are no players.</li>)}
            </ul>
          </div>
        </div>
    </div>
  )
};

export default Game