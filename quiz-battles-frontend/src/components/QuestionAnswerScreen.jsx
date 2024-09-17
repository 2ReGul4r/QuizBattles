import QuestionScreen from "./QuestionScreen";
import AnswerScreen from "./AnswerScreen";
import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";


const QuestionAnswerScreen = () => {
    const { gameState, activeRoom, activeQuestionIndex } = useGameContext();
    const { socket, isConnected } = useSocketContext();
    const { userState } = useUser();

    const handlEndQuestion = () => {
        const index = activeQuestionIndex;
        const categoryIndex = index%gameState.gameState.options.quiz.categoryCount;
        const questionIndex = Math.floor(index/gameState.gameState.options.quiz.categoryCount);
        socket.emit("endQuestion", categoryIndex, questionIndex, activeRoom);
    };

    const handleReveal = () => {
        const index = activeQuestionIndex;
        const categoryIndex = index%gameState.gameState.options.quiz.categoryCount;
        const questionIndex = Math.floor(index/gameState.gameState.options.quiz.categoryCount);
        socket.emit("toggleReveal", categoryIndex, questionIndex, activeRoom);
    };

    const handlBackToBoard = () => {
        socket.emit("backToBoard", activeRoom);
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center m-16">
                <p className="text-2xl mb-4">Loading...</p>
                <progress className="progress progress-primary w-96" />
            </div>
        )
    }

    if (!Object.keys(gameState.activeQuestion).length && !Object.keys(gameState.activeAnswer).length) {
        return (
            <div className="flex flex-col items-center justify-center m-16">
                <p className="text-2xl mb-4">Loading...</p>
                <progress className="progress progress-primary w-96" />
            </div>
        )
    }

    return (
        <div className="flex items-stretch flex-wrap justify-center flex-row gap-8">
            {!!Object.keys(gameState.activeQuestion).length && (<QuestionScreen/>)}
            {!!Object.keys(gameState.activeAnswer).length && (<AnswerScreen/>)}

            {/* HOST CONTROLS */}
            {userState.userID === gameState.host.userID && (
                <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-8 gap-8">
                    <h2 className="card-title">Host controls</h2>
                    <div className="card-actions">
                        <button className="btn btn-success" onClick={handleReveal}>Reveal {!Object.keys(gameState.activeQuestion).length ? "question" : "answer"}</button>
                        <button className="btn btn-error" onClick={handlEndQuestion}>Close question</button>
                        <button className="btn btn-primary" onClick={handlBackToBoard}>Back to board</button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default QuestionAnswerScreen
