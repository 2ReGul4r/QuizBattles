import QuestionScreen from "./QuestionScreen";
import AnswerScreen from "./AnswerScreen";
import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";


const QuestionAnswerScreen = () => {
    const { gameState, hostState, activeRoom } = useGameContext();
    const { socket, isConnected } = useSocketContext();
    const { userState } = useUser();

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
            {userState.userID === gameState.host.userID && (
                <div className="card bg-base-100 shadow-xl items-center text-center flex-grow basis-full p-8 gap-8">
                    <h2 className="card-title">Host controls</h2>
                    <div className="card-actions">
                        <button className="btn btn-success">Reveal answer</button>
                        <button className="btn btn-error">Close question</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuestionAnswerScreen
