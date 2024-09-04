import React, { useContext, useEffect } from "react";
import { QuizBattleContext } from "../contexts/CreateQuizBattleContext";

const CreateQuizOptions = () => {
    const { state, dispatch } = useContext(QuizBattleContext);

    useEffect(() => {
        if (state.categories.length < state.options.quiz.categoryCount)
        dispatch({ type: "SET_CATEGORY_COUNT", payload: 6 });
    }, [])
    

    const spansTimer = [];
    for (let i = 10; i <= 60; i += 5) {
        spansTimer.push(
        <span key={i}>
            {i}s
        </span>
        );
    }

    const spansCount = [];
    for (let i = 3; i <= 10; i +=1) {
        spansCount.push(
        <span key={i}>
            {i}
        </span>
        );
    }

    const handleOptionsChange = (option, newValue) => {
        dispatch({ type: "UPDATE_QUIZ_OPTION", option, payload: newValue });
    }

    const handleCategoryCountChange = (event) => {
        const newValue = parseInt(event.target.value);
        dispatch({ type: "SET_CATEGORY_COUNT", payload: newValue });
    }

    return (
        <div className="flex items-stretch flex-wrap gap-8 justify-center flex-row">
            <div className="card bg-base-200 shadow-xl items-center text-center basis-full">
                <div className="card-body justify-center w-full">
                    <h2 className="card-title self-center pb-4">QuizBattle Name:</h2>
                    <input type="text" value={state.name} className="input input-bordered self-center w-full max-w-xs" onChange={(event) => dispatch({ type: "SET_NAME", payload: event.target.value })} />
                </div>
            </div>
            <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-80">
                <div className="card-body justify-center w-full">
                    <h2 className="card-title self-center pb-4">Category Count: {state.options.quiz.categoryCount}</h2>
                    <input type="range" min={3} max="10" value={state.options.quiz.categoryCount} className="range range-primary" step="1" onChange={handleCategoryCountChange} />
                    <div className="w-full justify-between px-2 text-xs hidden min-[480px]:flex">
                        {spansCount}
                    </div>
                </div>
            </div>
            <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-80">
                <div className="card-body justify-center w-full">
                    <h2 className="card-title self-center pb-4">Questions per catergory: {state.options.quiz.questionsPerCategory}</h2>
                    <input type="range" min={3} max="10" value={state.options.quiz.questionsPerCategory} className="range range-primary" step="1" onChange={(event) => handleOptionsChange("questionsPerCategory", parseInt(event.target.value))} />
                    <div className="w-full justify-between px-2 text-xs hidden min-[480px]:flex">
                        {spansCount}
                    </div>
                </div>
            </div>
            <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-80">
                <div className="card-body justify-center w-full">
                    <h2 className="card-title self-center pb-4">Time to answer after buzzer: {state.options.quiz.buzzerAnswerTimer}s</h2>
                    <input type="range" min={10} max="60" value={state.options.quiz.buzzerAnswerTimer} className="range range-primary" step="5" onChange={(event) => handleOptionsChange("buzzerAnswerTimer", parseInt(event.target.value))} />
                    <div className="w-full justify-between px-2 text-xs hidden min-[480px]:flex">
                        {spansTimer}
                    </div>
                </div>
            </div>
            <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-80">
                <div className="card-body justify-center w-full">
                    <h2 className="card-title self-center pb-4">Are players able to buzzer multiple times?</h2>
                    <p>{state.options.quiz.multiBuzzer ? "Yes" : "No"}</p>
                    <input type="checkbox" className="checkbox checkbox-primary self-center" checked={state.options.quiz.multiBuzzer} onChange={(event) => handleOptionsChange("multiBuzzer", event.target.checked)}/>
                </div>
            </div>
        </div>
    )
}

export default CreateQuizOptions