import { useContext } from "react";
import { QuizBattleContext } from "../contexts/CreateQuizBattleContext";
import EditQuestionAnswerModal from "../components/EditQuestionAnswerModal";

const CreateBoard = () => {
    const { state, dispatch } = useContext(QuizBattleContext);
    const categoryCount = state.options.quiz.categoryCount;
    const questionsPerCategory = state.options.quiz.questionsPerCategory;

    const handleCategoryTitleChange = (categoryIndex, newValue) => {
        dispatch({ type: "RENAME_CATEGORY", categoryIndex, payload: newValue });
    }

    const getWorthForQuestion = (i) => {
        const category = state.categories[i % categoryCount];
        const question = category?.questions ? category.questions[Math.floor(i / categoryCount)] : undefined;
        return <h2 className="card-title self-center">{question?.worth ? `${question.worth} $` : "Unset"}</h2>
    }

    return (
        <div className="grid gap-8" style={{gridTemplateColumns: `repeat(${categoryCount}, 1fr)`}}>
            {Array.from(Array(categoryCount).keys()).map((categoryIndex) => (
                <div key={categoryIndex}>
                    <input
                        type="text"
                        placeholder={`Category ${categoryIndex+1}`}
                        value={state.categories[categoryIndex]?.title}
                        className="input input-bordered input-lg w-full"
                        onChange={(event) => handleCategoryTitleChange(categoryIndex, event.target.value)}
                    />
                </div>
            ))}
            {Array.from(Array((categoryCount * questionsPerCategory)).keys()).map((value, index) => (
                <div key={`${index%categoryCount}-${Math.floor(index/categoryCount)}`} className="card bg-base-200">
                    <div className="card-body cursor-pointer" onClick={()=> {document.getElementById(`modal-${index}`).showModal();}}>
                        {getWorthForQuestion(index)}
                    </div>
                    <EditQuestionAnswerModal modalIndex={index} categoryIndex={index%categoryCount} questionIndex={Math.floor(index/categoryCount)}/>
                </div>
            ))}
        </div>
    )
}

export default CreateBoard