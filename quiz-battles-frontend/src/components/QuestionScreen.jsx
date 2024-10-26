import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";

const QuestionScreen = () => {
    const { gameState, activeRoom, hostState, roomState } = useGameContext();
    const { socket } = useSocketContext();
    const { userState } = useUser();
    const [localBuzzed, setLocalBuzzed] = useState(false);
    const [buzzerTimer, setbuzzerTimer] = useState(0);
    const [buzzerResults, setBuzzerResults] = useState([])

    useEffect(() => {
        socket.on("buzzerResults", (results) => {
            setLocalBuzzed(false);
            setBuzzerResults(results);
        });
        socket.on("updateBuzzerTime", (newBuzzerTime) => {
            setbuzzerTimer(newBuzzerTime);
        })
        document.body.addEventListener("keypress", handleKeyPressEvent);
        return () => {
          document.body.removeEventListener("keypress", handleKeyPressEvent);
        }
    }, [socket]);

    useEffect(() => {
        if (!Object.keys(gameState.activeBuzzer).length) {
            setBuzzerResults([]);
        }
    }, [gameState.activeBuzzer]);
    
    const handleKeyPressEvent = (event) => {
        if (event.code === "Space") {
            event.preventDefault();
            handleBuzzerPress();
        }
    };

    const handleBuzzerPress = () => {
        if (Object.keys(gameState.activeBuzzer).length) return
        socket.emit("buzzerPress", activeRoom, () => {
            setLocalBuzzed(true);
        });
    };

    const handleSkipPress = () => {
        socket.emit("skippingPress", activeRoom);
    };

    const handleCorrectAnswer = () => {
        socket.emit("correctBuzzerAnswer", activeRoom);
    };

    const handleWrongAnswer = () => {
        socket.emit("wrongBuzzerAnswer", activeRoom);
    };

    const getRoomStateAnswerToQuestion = () => {
        const categoryIndex = gameState?.activeQuestion?.categoryIndex;
        const questionIndex = gameState?.activeQuestion?.questionIndex;
        return roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.answer
    };

    return (
        <div className="flex flex-col gap-4 flex-grow">
            <div className={`card bg-base-100 shadow-xl items-center text-center basis-full p-4 gap-4 ${gameState?.activeBuzzer?.userID === userState.userID && "buzzer-success"}`}>
            <div className="flex flex-row w-full justify-between"><h2 className="text-2xl">Buzzer</h2><h2 className="text-2xl">{`+${gameState.activeQuestion.worth}$/-${parseInt(gameState.activeQuestion.worth * gameState.gameState.options.money.lossOnWrongAnswer)}$`}</h2></div>
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
                        <audio controls controlsList="nodownload noplaybackrate" autoPlay key={index}>
                            <source src={audioBase64}/>
                            Your browser does not support the audio element.
                        </audio>
                    )
                })}
            </div>

            {/*USER CONTROLS */}
            {userState.userID !== gameState.host.userID && !Object.keys(gameState.activeBuzzer).length && gameState.hasActiveQuestion && (
                <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-4 gap-4">
                    <div className="card-actions">
                        {gameState.activeQuestion.questionType === "buzzer" && (
                            <button className={`btn h-8 w-64 ${!localBuzzed ? "btn-success" : "btn-warning" } ${gameState.buzzeredPlayers?.some(playerObj => playerObj.userID === userState.userID) && "btn-disabled"}`} onClick={handleBuzzerPress}>BUZZER</button>
                        )}
                        {gameState.activeQuestion.questionType === "guess" && (
                            <input type="text" placeholder="Answer" className="input input-bordered w-full" onInput={"updateInput"} />
                        )}
                        {!gameState.buzzeredPlayers?.some(playerObj => playerObj.userID === userState.userID) && (
                            <button className="btn btn-outline btn-error" onClick={handleSkipPress}>{Object.keys(gameState.skippingPlayers).includes(userState.userID) ? "Unskip" : "Skip" }</button>
                        )}
                    </div>
                </div>
            )}

            {/* ACTIVE BUZZER */}
            {!!Object.keys(gameState.activeBuzzer).length && (
                <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-4 gap-4">
                    <div className="card-body">
                        <div className="flex flex-col">
                            <span className="countdown font-mono text-5xl">
                                <p style={{"--value": buzzerTimer}}></p>
                            </span>
                            sec
                        </div>
                        <h2 className="card-title text-xl text-primary">{`Buzzer was pressed by ${gameState.activeBuzzer.username}`}</h2>
                        {buzzerResults.slice(1).map(({userID, username, correctedBuzzTime}) => {
                            return (<h3 key={userID} className="text-sm text-error">{`${username} pressed the buzzer ${correctedBuzzTime - gameState.activeBuzzer.correctedBuzzTime}ms too late...`}</h3>)
                        })}
                    </div>
                    {userState.userID === gameState.host.userID && (
                        <div className="card-actions">
                            <button className="btn btn-success" onClick={handleCorrectAnswer}>Correct answer</button>
                            <button className="btn btn-error" onClick={handleWrongAnswer}>Wrong answer</button>
                        </div>
                    )}
                </div>
            )}

            {/* ANSWER DISPLAY FOR HOST */}
            {userState.userID === gameState.host.userID && !!Object.keys(roomState).length && (
                <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-4 gap-4">
                    <h2 className="card-title text-2xl">Answer</h2>
                    <div className="self-center text-xl">{getRoomStateAnswerToQuestion().text || "No answer found!"}</div>
                    {Array.from(getRoomStateAnswerToQuestion()?.picture || []).map((pictureBase64, index) => {
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
                    {Array.from(getRoomStateAnswerToQuestion()?.audio || []).map((audioBase64, index) => {
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
};

export default QuestionScreen