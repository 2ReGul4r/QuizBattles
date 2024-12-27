import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import DOMPurify from 'dompurify';

const QuestionScreen = () => {
    const { gameState, hostState, roomState } = useGameContext();
    const { socket } = useSocketContext();
    const { userState } = useUser();
    const [localBuzzed, setLocalBuzzed] = useState(false);
    const [buzzerTimer, setbuzzerTimer] = useState(0);
    const [buzzerResults, setBuzzerResults] = useState([]);
    const [guessAnswer, setGuessAnswer] = useState("");

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

    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        if ('target' in node) {
          node.setAttribute('target', '_blank');
        }
        if (
          !node.hasAttribute('target') &&
          (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
        ) {
          node.setAttribute('xlink:show', 'new');
        }
    });
    
    const handleKeyPressEvent = (event) => {
        const activeElement = document.activeElement;
        // Prüfen, ob das aktive Element ein Eingabefeld ist
        if (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.isContentEditable
        ) {
          return; // Event ignorieren
        }
        if (gameState.activeQuestion.questionType === "buzzer" && event.code === "Space") {
            event.preventDefault();
            handleBuzzerPress();
        }
    };

    const handleBuzzerPress = () => {
        if (Object.keys(gameState.activeBuzzer).length) return
        socket.emit("buzzerPress", () => {
            setLocalBuzzed(true);
        });
    };

    const handleGuessAnswerInput = (event) => {
        const answer = event.target.value;
        setGuessAnswer(answer);
        socket.emit("guessAnswerUpdate", answer);
    };

    const handleSkipPress = () => {
        socket.emit("skippingPress");
    };

    const handleCorrectAnswer = () => {
        socket.emit("correctBuzzerAnswer");
    };

    const handleWrongAnswer = () => {
        socket.emit("wrongBuzzerAnswer");
    };

    const handleCorrectGuess = (userID, event) => {
        disableGuessButtons(event);
        socket.emit("correctGuess", userID);
    };

    const handleWrongGuess = (userID, event) => {
        disableGuessButtons(event);
        socket.emit("wrongGuess", userID);
    };

    const disableGuessButtons = (event) => {
        const parent = event.target.parentElement;
        Array.from(parent.children).map((elements) => elements.disabled = true);
    };

    const getRoomStateAnswerToQuestion = () => {
        const categoryIndex = gameState?.activeQuestion?.categoryIndex;
        const questionIndex = gameState?.activeQuestion?.questionIndex;
        return roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.answer
    };

    return (
        <div className="flex flex-col gap-4 flex-grow">
            <div className={`card bg-base-100 shadow-xl items-center text-center basis-full p-4 gap-4 ${gameState?.activeBuzzer?.userID === userState.userID && "buzzer-success"}`}>
            <div className="flex flex-row w-full justify-between"><h2 className="text-2xl">{gameState.activeQuestion.questionType.toUpperCase() || ""}</h2><h2 className="text-2xl">{`+${gameState.activeQuestion.worth}$/-${parseInt(gameState.activeQuestion.worth * gameState.gameState.options.money.lossOnWrongAnswer)}$`}</h2></div>
                {gameState.activeQuestion.question && (<div className="font-semibold self-center text-4xl quiz-battle-question" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(gameState.activeQuestion.question, {ALLOWED_TAGS: ['a', 'b', 'br', 'h3', 'h4', 'h5', 'sub', 'sup']})}}></div>)}
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
                    {gameState.activeQuestion.questionType === "guess" &&
                        <div className="card-title">{gameState.activeGuessInput ? "Give your guess" : "Guesses are locked!"}</div>
                    }
                    <div className="card-actions w-2/3 justify-center">
                        {gameState.activeQuestion.questionType === "buzzer" && (
                            <button className={`btn h-8 w-64 ${!localBuzzed ? "btn-success" : "btn-warning" } ${gameState.buzzeredPlayers?.some(playerObj => playerObj.userID === userState.userID) && "btn-disabled"}`} onClick={handleBuzzerPress}>BUZZER</button>
                        )}
                        {gameState.activeQuestion.questionType === "guess" && (
                            <input type="text" disabled={!gameState.activeGuessInput} placeholder="Answer" className={`input input-bordered w-full ${!gameState.activeGuessInput && "input-disabled"}`} onInput={handleGuessAnswerInput} />
                        )}
                        {!gameState.buzzeredPlayers?.some(playerObj => playerObj.userID === userState.userID) && gameState.activeQuestion.questionType === "buzzer" && (
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
            {userState.userID === gameState.host.userID && gameState.activeQuestion.questionType === "guess" && !!Object.keys(hostState).length &&
                <div className="card bg-base-100 shadow-xl items-center text-center p-4 gap-4 w-full">
                    <h2 className="card-title text-2xl">Guesses</h2>
                    <div className="flex items-stretch flex-wrap justify-center flex-row gap-4 w-full">
                        {Object.entries(gameState.players).map(([userID, playerObject]) => (
                            <div key={userID} className="card bg-base-200 shadow-xl items-center text-center flex-grow flex-shrink w-1/5 p-4 gap-4">
                                <div className="card-title">{playerObject.username}</div>
                                <p className="overflow-x-auto w-full">{hostState.activeGuesses[userID]?.guess || "No guess given!"}</p>
                                <div className="card-actions justify-center">
                                    <button className="btn btn-success" onClick={(event) => handleCorrectGuess(userID, event)}>Correct answer</button>
                                    <button className="btn btn-error" onClick={(event) => handleWrongGuess(userID, event)}>Wrong answer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
};

export default QuestionScreen
