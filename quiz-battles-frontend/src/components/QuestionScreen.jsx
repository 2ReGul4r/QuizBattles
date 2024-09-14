import { useGameContext } from "../contexts/GameContext";

const QuestionScreen = () => {
    const { gameState } = useGameContext();
    return (
        <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-8 gap-8">
            {gameState.activeQuestion.question && (<div className="card-title self-center text-4xl">{gameState.activeQuestion.question}</div>)}
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
                    <audio controls controlsList="nodownload noplaybackrate" autoplay key={index}>
                        <source src={audioBase64}/>
                        Your browser does not support the audio element.
                    </audio>
                )

            })}
        </div>
    )
}

export default QuestionScreen