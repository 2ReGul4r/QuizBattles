import React, { useContext } from "react";
import { QuizBattleContext } from "../contexts/CreateQuizBattleContext";

const CreateMoneyOptions = () => {
    const { state, dispatch } = useContext(QuizBattleContext);

    const handleOptionsChange = (option, newValue) => {
        dispatch({ type: "UPDATE_MONEY_OPTION", option, payload: newValue });
    };

    const percentages = [];
    for (let i = 0; i <= 100; i +=25) {
        percentages.push(<span key={i}>{i}%</span>);
    }

    return (
        <div className="flex items-stretch flex-wrap gap-8 justify-center flex-row">
            <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-80">
                <div className="card-body justify-center w-full">
                    <h2 className="card-title self-center font-bold">Starting money</h2>
                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                        <input type="number" className="grow no-spinner text-end" min="0" value={state.options.money.starting} onChange={(event) => handleOptionsChange("starting", parseInt(event.target.value))}/>
                        <span>$</span>
                    </label>
                </div>
            </div>
            <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-80">
            <div className="card-body justify-center w-full">
                    <h2 className="card-title self-center font-bold">Passive money per round</h2>
                    <label className="input input-bordered flex items-center gap-4 mb-2 input-primary">
                        <input type="number" className="grow no-spinner text-end" min="0" value={state.options.money.gainPerRound} onChange={(event) => handleOptionsChange("gainPerRound", parseInt(event.target.value))}/>
                        <span>$</span>
                    </label>
                </div>
            </div>
            <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-80">
                <div className="card-body justify-center w-full">
                    <h2 className="card-title self-center pb-4">Score penalty on wrong answers: {parseInt(state.options.money.lossOnWrongAnswer * 100)}%</h2>
                    <input type="range" min={0} max="1" value={state.options.money.lossOnWrongAnswer} className="range range-primary" step="0.01" onChange={(event) => handleOptionsChange("lossOnWrongAnswer", parseFloat(event.target.value))} />
                    <div className="w-full justify-between px-2 text-xs flex">
                        {percentages}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateMoneyOptions;
