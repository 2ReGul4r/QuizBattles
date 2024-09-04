import React, {useState, useContext} from "react";
import { QuizBattleContext } from "../contexts/CreateQuizBattleContext";

const EditQuestionAnswerModal = (props) => {
    const initialQuestionState = {
        question: "",
        picture: [],
        audio: [],
        worth: undefined,
        questionType: "",
        isLockedForCount: 0
    };

    const initialAnswerState = {
        text: "",
        picture: [],
        audio: [],
    };

    const { state, dispatch } = useContext(QuizBattleContext);
    const [question, setQuestion] = useState(initialQuestionState);
    const [answer, setAnswer] = useState(initialAnswerState);
    const {modalIndex, categoryIndex, questionIndex} = props;
    
    const setQuestionOption = (option, newValue) => {
        setQuestion({...question, [option]: newValue});
    };

    const setAnswerOption = (option, newValue) => {
        setAnswer({...answer, [option]: newValue});
    };

    const handleAnswerFileChange = (filetype, event) => {
        const files = event.target.files;
        const fileReaders = [];
    
        Object.keys(files).forEach((i) => {
            const file = files[i];
            const reader = new FileReader();
            const fileReaderPromise = new Promise((resolve) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
            fileReaders.push(fileReaderPromise);
        });
    
        Promise.all(fileReaders).then((results) => {
            setAnswer({...answer, [filetype]: [...answer[filetype], ...results]});
        });
    };

    const handleQuestionFileChange = (filetype, event) => {
        const files = event.target.files;
        const fileReaders = [];
    
        Object.keys(files).forEach((i) => {
            const file = files[i];
            const reader = new FileReader();
            const fileReaderPromise = new Promise((resolve) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
            fileReaders.push(fileReaderPromise);
        });
    
        Promise.all(fileReaders).then((results) => {
            setQuestion({...question, [filetype]: [...question[filetype], ...results]});
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const final = {...question, answer};
        dispatch({ type: "ADD_QUESTION", categoryIndex, questionIndex, payload: final });
        document.getElementById(`modal-${modalIndex}`).close();
    };

    const handleClose = (event) => {
        event.preventDefault();
        document.getElementById(`modal-${modalIndex}`).close();
    };

    return (
        <dialog id={`modal-${modalIndex}`} className="modal">
            <div className="flex flex-col w-9/12 hero bg-base-300 rounded-lg p-8">
                <div className="flex flex-row gap-8 w-full">
                    <div className="card bg-base-100 w-full flex-grow">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title mb-2">Question</h2>
                            <textarea className="textarea textarea-bordered w-full" value={question.question} placeholder="Question Text" onInput={(event) => setQuestionOption("question", event.target.value)}/>
                            <div className="form-control w-full">
                                <label className="label cursor-pointer">
                                    <span className="label-text pr-4">Picture</span>
                                    <input type="file" multiple className={`file-input w-full max-w-lg ${question.picture.length > 0 ? "file-input-success" : "file-input-bordered"}`} accept="image/png, image/gif, image/jpeg" onChange={(event) => handleQuestionFileChange("picture", event)}/>
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className="label cursor-pointer">
                                    <span className="label-text pr-4">Audio</span>
                                    <input type="file" multiple className={`file-input w-full max-w-lg ${question.audio.length > 0 ? "file-input-success" : "file-input-bordered"}`} onChange={(event) => handleQuestionFileChange("audio", event)}/>
                                </label>
                            </div>
                            <label className="input input-bordered flex items-center gap-4 mb-2 w-full">
                                <span className="label-text font-bold">Worth</span>
                                <input type="number" className="grow spinner text-end no-spinner" value={question.worth} min="0" onChange={(event) => setQuestionOption("worth", parseInt(event.target.value))}/>
                                <span>$</span>
                            </label>
                            <select className="select select-bordered w-full mb-2" defaultValue="default" onChange={(event) => setQuestionOption("questionType", event.target.value)}>
                                <option disabled value="default" className="font-bold">Question type</option>
                                <option value="buzzer">Buzzer</option>
                                <option value="guess">Guess</option>
                            </select>
                            <label className="input input-bordered flex items-center gap-4 w-full">
                                <span className="label-text font-bold">Rounds locked</span>
                                <input type="number" className="grow spinner text-end no-spinner" value={question.isLockedForCount} min="0" onChange={(event) => setQuestionOption("isLockedForCount" , parseInt(event.target.value))}/>
                            </label>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-full flex-grow">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title mb-2">Answer</h2>
                            <textarea className="textarea textarea-bordered w-full" placeholder="Answer Text" value={answer.text} onInput={(event) => setAnswerOption("text", event.target.value)}/>
                            <div className="form-control w-full">
                                <label className="label cursor-pointer">
                                    <span className="label-text pr-4">Picture</span>
                                    <input type="file" multiple className={`file-input w-full max-w-lg ${answer.picture.length > 0 ? "file-input-success" : "file-input-bordered"}`} accept="image/png, image/gif, image/jpeg" onChange={(event) => handleAnswerFileChange("picture", event)}/>
                                </label>
                            </div>
                            <div className="form-control w-full">
                                <label className="label cursor-pointer">
                                    <span className="label-text pr-4">Audio</span>
                                    <input type="file" multiple className={`file-input w-full max-w-lg ${answer.audio.length > 0 ? "file-input-success" : "file-input-bordered"}`} onChange={(event) => handleAnswerFileChange("audio", event)}/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full modal-action">
                    <form method="dialog" className="w-full flex gap-8">
                        <button className="btn btn-primary flex-grow" onClick={handleSubmit}>Save</button>
                        <button className="btn btn-primary" onClick={handleClose}>Dismiss</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default EditQuestionAnswerModal