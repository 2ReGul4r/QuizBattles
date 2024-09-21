import { useContext } from "react";
import { QuizBattleContext } from "../contexts/CreateQuizBattleContext";
import CreateQuizOptions from "./CreateQuizOptions";
import CreateBattleOptions from "./CreateBattleOptions";
import CreateBoard from "./CreateBoard";
import CreateMoneyOptions from "./CreateMoneyOptions";
import PropTypes from "prop-types";

const CreateQuizPagesWrapper = ({page}) => {
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
            {page === 1 && (<CreateQuizOptions/>)}
            {page === 2 && (<CreateMoneyOptions/>)}
            {page === 3 && (<CreateBattleOptions/>)}
            {page === 4 && (<CreateBoard/>)}
        </div>
    )
}

CreateQuizPagesWrapper.propTypes = {
    page: PropTypes.number,
};

export default CreateQuizPagesWrapper