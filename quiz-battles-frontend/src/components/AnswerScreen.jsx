import { useGameContext } from "../contexts/GameContext";

const AnswerScreen = () => {
    const { gameState, hostState } = useGameContext();
    return (
        <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-8 gap-8">
            {gameState.activeAnswer.text && (<div className="card-title self-center">{gameState.activeAnswer.text}</div>)}
            {Array.from(gameState.activeAnswer.picture).map((pictureBase64) => {
                <img src={pictureBase64}></img>
            })}
            {Array.from(gameState.activeAnswer.audio).map((audioBase64) => {
                <audio controls>
                    <source src={audioBase64}/>
                    Your browser does not support the audio element.
                </audio>
            })}
        </div>
    )
}

export default AnswerScreen
