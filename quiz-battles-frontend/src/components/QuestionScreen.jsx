import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";

const QuestionScreen = () => {
    const { gameState, activeRoom, hostState } = useGameContext();
    const { socket } = useSocketContext();
    const { userState } = useUser();

    useEffect(() => {
        socket.on("buzzerResults", (results) => {
            //
        });
        document.body.addEventListener("keypress", handleKeyPressEvent);
        return () => {
          document.body.removeEventListener("keypress", handleKeyPressEvent);
        }
      }, [])
    
      const handleKeyPressEvent = (event) => {
        if (event.code === "Space") {
            event.preventDefault();
            handleBuzzerPress();
        }
      }

    const handleBuzzerPress = () => {
        socket.emit("buzzerPress", activeRoom);
    };

    const getHostStateAnswerToQuestion = () => {
        const categoryIndex = hostState?.activeQuestion?.categoryIndex;
        const questionIndex = hostState?.activeQuestion?.questionIndex;
        return hostState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.answer
    };

    return (
        <div className="flex flex-col gap-8 flex-grow">
            <div className="card bg-base-100 shadow-xl items-center text-center basis-full p-8 gap-8">
            <h2 className="card-title text-2xl">Question</h2>
                {gameState.activeQuestion.question && (<div className="font-semibold self-center text-4xl">{gameState.activeQuestion.question}</div>)}
                {Array.from(gameState.activeQuestion.picture).map((pictureBase64, index) => {
                    return (
                        <div key={index}>
                            <img className="h-64 cursor-zoom-in" src={pictureBase64} alt={`question-picture-${index}`} onClick={()=>document.getElementById(`question-picture-modal-${index}`).showModal()}/>
                            <dialog id={`question-picture-modal-${index}`} className="modal">
                                <div className="modal-box max-w-full max-h-full flex flex-col">
                                    <img className="overflow-auto image-full self-center" src={pictureBase64} alt={`question-picture-${index}-full`}/>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            <button className="btn">Close</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                    )
                })}
                {Array.from(gameState.activeQuestion.audio).map((audioBase64, index) => {
                    return (
                        <audio controls controlsList="nodownload noplaybackrate" key={index}>
                            <source src={audioBase64}/>
                            Your browser does not support the audio element.
                        </audio>
                    )

                })}
            </div>

            {/*USER CONTROLS */}
            {userState.userID !== gameState.host.userID && (
                <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-8 gap-8">
                    <div className="card-body">
                        {gameState.activeQuestion.questionType === "buzzer" && (
                            <button className={`btn btn-circle h-64 w-64 ${!gameState.activeBuzzer ? "btn-success" : "btn-error" }`} onClick={handleBuzzerPress}>BUZZER</button>
                        )}
                        {gameState.activeQuestion.questionType === "guess" && (
                            <input type="text" placeholder="Answer" className="input input-bordered w-full" onInput={updateInput} />
                        )}
                    </div>
                    <div className="card-actions">
                        <button className="btn btn-outline btn-error">Skip</button>
                    </div>
                </div>
            )}

            {/* ANSWER DISPLAY FOR HOST */}
            {userState.userID === gameState.host.userID && !!Object.keys(hostState).length && (
                <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-8 gap-8">
                    <h2 className="card-title text-2xl">Answer</h2>
                    {getHostStateAnswerToQuestion()?.text && (<div className="self-center text-xl">{getHostStateAnswerToQuestion().text}</div>)}
                    {Array.from(getHostStateAnswerToQuestion()?.picture || []).map((pictureBase64, index) => {
                        return (
                            <div key={index}>
                                <img className="h-64 cursor-zoom-in" src={pictureBase64} alt={`answer-picture-${index}`} onClick={()=>document.getElementById(`answer-picture-modal-${index}`).showModal()}/>
                                <dialog id={`answer-picture-modal-${index}`} className="modal">
                                    <div className="modal-box max-w-full max-h-full flex flex-col">
                                        <img className="overflow-auto image-full self-center" src={pictureBase64} alt={`answer-picture-${index}-full`}/>
                                        <div className="modal-action">
                                            <form method="dialog">
                                                <button className="btn">Close</button>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>
                            </div>
                        )
                    })}
                    {Array.from(getHostStateAnswerToQuestion()?.audio || []).map((audioBase64, index) => {
                        return (
                            <audio controls controlsList="nodownload noplaybackrate" key={index}>
                                <source src={audioBase64}/>
                                Your browser does not support the audio element.
                            </audio>
                        )

                    })}
                </div>
            )}
        </div>
    )
}

export default QuestionScreen