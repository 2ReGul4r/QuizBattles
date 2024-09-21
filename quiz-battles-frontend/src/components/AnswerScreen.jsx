import { useGameContext } from "../contexts/GameContext";

const AnswerScreen = () => {
    const { gameState } = useGameContext();

    return (
        <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-8 gap-8">
            {gameState.activeAnswer.text && (<div className="card-title self-center text-4xl">{gameState.activeAnswer.text}</div>)}
            {Array.from(gameState.activeAnswer.picture).map((pictureBase64, index) => {
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
            {Array.from(gameState.activeAnswer.audio).map((audioBase64, index) => {
                return (
                    <audio controls controlsList="nodownload noplaybackrate" autoPlay key={index}>
                        <source src={audioBase64}/>
                        Your browser does not support the audio element.
                    </audio>
                )
            })}
        </div>
    )
}

export default AnswerScreen
