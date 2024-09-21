import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faImage } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/UserContext";

const Board = () => {
    const { gameState, activeRoom, markedQuestion, setActiveQuestionIndex } = useGameContext();
    const { socket, isConnected } = useSocketContext();
    const { userState } = useUser();

    const getQuestion = (index) => {
        if (Object.keys(gameState).length <= 0) return undefined
        const category = gameState.gameState.categories[index % gameState.gameState.options.quiz.categoryCount];
        return category?.questions ? category.questions[Math.floor(index / gameState.gameState.options.quiz.categoryCount)] : undefined;
    };

    const getWorthForQuestion = (index) => {
        const question = getQuestion(index);
        return question?.worth ? `${question.worth}$` : ""
    };

    const hasQuestionPicture = (index) => {
        const question = getQuestion(index);
        return !!question?.hasPicture
    };

    const hasQuestionAudio = (index) => {
        const question = getQuestion(index);
        return !!question?.hasAudio
    };

    const isQuestionAnswered = (index) => {
        const question = getQuestion(index);
        return !!question?.isAnswered
    };

    const questionAnsweredBy = (index) => {
        const question = getQuestion(index);
        if (!question) return ""
        if (Array.from(question.answeredFrom).length === 1 ) {
            return question?.answeredFrom[0]?.username || ""
        } else {
            return Array.from(question.answeredFrom).map(userObj => userObj.username.slice(0, 2)).join(" and ")
        }
    };

    const handleQuestionClick = (index) => {
        if (!isConnected) return
        if (isQuestionAnswered(index)) return
        if (userState.userID === gameState.host.userID) {
            const categoryIndex = index%gameState.gameState.options.quiz.categoryCount;
            const questionIndex = Math.floor(index/gameState.gameState.options.quiz.categoryCount);
            setActiveQuestionIndex(index);
            socket.emit("revealQuestion", categoryIndex, questionIndex, activeRoom);
        }
        if (userState.userID !== gameState.activePlayer.userID) return
        socket.emit("markQuestion", index, activeRoom);
    };

    const getQuestionCursor = (index) => {
        const question = getQuestion(index);
        if (userState.userID === gameState.host.userID) return "cursor-pointer" 
        if (!question) return "cursor-default"
        if (question?.isAnswered) return "cursor-not-allowed"
        if (userState.userID === gameState?.activePlayer?.userID) return "cursor-pointer"
        return "cursor-default"
    }

    if (!Object.keys(gameState).length) {
        return <div>Loading...</div>
    }
    return (
        <div className="grid gap-4 w-full" style={{gridTemplateColumns: `repeat(${gameState.gameState.options.quiz.categoryCount}, 1fr)`}}>
            {Array.from(Array(gameState.gameState.options.quiz.categoryCount).keys()).map((categoryIndex) => (
                <div key={categoryIndex} className="card bg-zinc-900">
                    <div className="flex flex-col flex-grow flex-shrink basis-auto p-8 cursor-default">
                        <div className="card-title self-center text-white text-2xl overflow-x-clip">{gameState.gameState.categories[categoryIndex].categoryName}</div>
                    </div>
                </div>
            ))}
            {Array.from(Array((gameState.gameState.options.quiz.categoryCount * gameState.gameState.options.quiz.questionsPerCategory)).keys()).map((value, index) => (
                <div 
                    key={`${index%gameState.gameState.options.quiz.categoryCount}-${Math.floor(index/gameState.gameState.options.quiz.categoryCount)}`} 
                    className={`card ${isQuestionAnswered(index) ? "bg-slate-900 opacity-25" : "bg-base-100"} ${markedQuestion === index && !isQuestionAnswered(index) && "marked-question-border"}`}
                >
                    <div 
                        className={`flex flex-col flex-grow flex-shrink basis-auto p-6 ${getQuestionCursor(index)}`}
                        onClick={() => handleQuestionClick(index)}
                    >
                        {isQuestionAnswered(index) && <div className="absolute top-4 left-4">{questionAnsweredBy(index)}</div>}
                        <div className="card-title self-center text-2xl">{getWorthForQuestion(index)}</div>
                        <div className="card-actions">
                            {hasQuestionPicture(index) && <FontAwesomeIcon className="absolute bottom-4 left-4" icon={faImage} />}
                            {hasQuestionAudio(index) && <FontAwesomeIcon className="absolute bottom-4 right-4" icon={faHeadphones} />}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Board