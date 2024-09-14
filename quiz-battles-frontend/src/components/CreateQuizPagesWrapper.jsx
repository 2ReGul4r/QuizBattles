import { useContext } from "react";
import { QuizBattleContext } from "../contexts/CreateQuizBattleContext";
import CreateQuizOptions from "./CreateQuizOptions";
import CreateBattleOptions from "./CreateBattleOptions";
import CreateBoard from "./CreateBoard";
import CreateMoneyOptions from "./CreateMoneyOptions";

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
            {props.page === 2 && (<CreateMoneyOptions/>)}
            {props.page === 3 && (<CreateBattleOptions/>)}
            {props.page === 4 && (<CreateBoard/>)}
        </div>
    )
}

export default CreateQuizPagesWrapper