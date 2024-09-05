import { useContext } from "react";
import { QuizBattleContext } from "../contexts/CreateQuizBattleContext";
import CreateQuizOptions from "./CreateQuizOptions";
import CreateBattleOptions from "./CreateBattleOptions";
import CreateBoard from "./CreateBoard";

const CreateQuizPagesWrapper = (props) => {
    const { state } = useContext(QuizBattleContext);

    if (Object.keys(state).length <= 0) {
        return (
            <div className="flex flex-col items-center justify-center m-16">
                <p className="text-2xl mb-4">Loading...</p>
                <progress className="progress progress-primary w-96"/>
            </div>
        );
    }

    return (
        <div>
            {props.page === 1 && (<CreateQuizOptions/>)}
            {props.page === 2 && (<CreateBattleOptions/>)}
            {props.page === 3 && (<CreateBoard/>)}
        </div>
    )
}

export default CreateQuizPagesWrapper