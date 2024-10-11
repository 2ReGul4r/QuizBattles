import {useState, useContext, useEffect} from "react";
import { QuizBattleContext } from "../contexts/CreateQuizBattleContext";
import PropTypes from "prop-types";
import { uploadFile } from "../services/media.service";
import toast from "react-hot-toast";

const EditQuestionAnswerModal = ({modalIndex, categoryIndex, questionIndex}) => {
    const { state, dispatch } = useContext(QuizBattleContext);
    const [question, setQuestion] = useState({});
    const [answer, setAnswer] = useState({});

    useEffect(() => {
        const loadQuestionData = () => {
            const pictureBase64 = state?.categories[categoryIndex]?.questions[questionIndex]?.picture || [];
            const audioBase64 = state?.categories[categoryIndex]?.questions[questionIndex]?.audio || [];

            const answerPictureBase64 = state?.categories[categoryIndex]?.questions[questionIndex]?.answer?.picture || [];
            const answerAudioBase64 = state?.categories[categoryIndex]?.questions[questionIndex]?.answer?.audio || [];

            setQuestion({
                question: state?.categories[categoryIndex]?.questions[questionIndex]?.question || "",
                picture: pictureBase64,
                audio: audioBase64,
                worth: state?.categories[categoryIndex]?.questions[questionIndex]?.worth || 500,
                questionType: state?.categories[categoryIndex]?.questions[questionIndex]?.questionType || "buzzer",
                isLockedForCount: state?.categories[categoryIndex]?.questions[questionIndex]?.isLockedForCount || 0
            });

            setAnswer({
                text: state?.categories[categoryIndex]?.questions[questionIndex]?.answer?.text || "",
                picture: answerPictureBase64,
                audio: answerAudioBase64,
            });
        };

        loadQuestionData();
    }, [state, categoryIndex, questionIndex]);
    
    const setQuestionOption = (option, newValue) => {
        setQuestion({...question, [option]: newValue});
    };

    const setAnswerOption = (option, newValue) => {
        setAnswer({...answer, [option]: newValue});
    };

    const handleFileChange = (filetype, event, isAnswer) => {
        const files = event.target.files;
        const fileReaders = [];
    
        Object.keys(files).forEach((i) => {
            const file = files[i];
            const reader = new FileReader();
    
            const fileReaderPromise = new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(reader.error);
                };
                reader.readAsArrayBuffer(file);
            });
            fileReaders.push(fileReaderPromise);
        });
        
        Promise.all(fileReaders).then(async (fileBuffers) => {
            const formData = new FormData();
            // Füge jede Datei einzeln zu FormData hinzu
            formData.append("fileType", filetype);
            fileBuffers.forEach((buffer, index) => {
                const blob = new Blob([buffer], { type: files[index].type });
                formData.append("file", blob, files[index].name); // Füge Blob als Datei hinzu
            });
            const fileURL = await uploadFile(formData);
            if (filetype === 'picture') {
                if (isAnswer) {
                    setAnswerOption('picture', [...answer.picture, fileURL]);
                } else {
                    setQuestionOption('picture', [...question.picture, fileURL]);
                }
            } else if (filetype === 'audio') {
                if (isAnswer) {
                    setAnswerOption('audio', [...answer.audio, fileURL]);
                } else {
                    setQuestionOption('audio', [...question.audio, fileURL]);
                }
            }
        }).catch(error => {
            console.error("Error reading files:", error);
        });
    };

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

    const handleClear = (event) => {
        event.preventDefault();
        setQuestion({
            question: "",
            picture: [],
            audio: [],
            worth: 500,
            questionType: "buzzer",
            isLockedForCount: 0
        });
        setAnswer({
            text: "",
            picture: [],
            audio: []
        });
    };

    const getMaxLockCount = () => {
        return (state.options.quiz.questionsPerCategory * state.options.quiz.categoryCount) - 1
    };

    if (Object.keys(question).length <= 0 || Object.keys(answer).length <= 0) {
        return (
            <div className="flex flex-col items-center justify-center m-16">
                <p className="text-2xl mb-4">Loading...</p>
                <progress className="progress progress-primary w-96" />
            </div>
        )
    }

    return (
        <dialog id={`modal-${modalIndex}`} className="modal overflow-y-auto">
            <div className="flex flex-col w-9/12 hero bg-base-300 rounded-lg p-8">
                <div className="flex flex-row gap-8 w-full">
                    <div className="card bg-base-100 w-full flex-grow">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title mb-2">Question</h2>
                            <textarea className="textarea textarea-bordered w-full" value={question.question} placeholder="Question Text" onInput={(event) => setQuestionOption("question", event.target.value)}/>
                            <div className="form-control w-full">
                                <label className="label cursor-pointer">
                                    <span className="label-text pr-4">Pictures</span>
                                    <input type="file" className={`file-input w-full max-w-lg ${question.picture.length > 0 ? "file-input-success" : "file-input-bordered"}`} accept="image/*" onChange={(event) => handleFileChange("picture", event, false)}/>
                                </label>
                                <div className="flex gap-2 overflow-auto">
                                    {question.picture.map((data, index) => {
                                        return <img key={index} src={data} alt={`question-pic-${index}`} width="100" />
                                    })}
                                </div>
                            </div>
                            <div className="form-control w-full">
                                <label className="label cursor-pointer">
                                    <span className="label-text pr-4">Audios</span>
                                    <input type="file" className={`file-input w-full max-w-lg ${question.audio.length > 0 ? "file-input-success" : "file-input-bordered"}`} accept="audio/*" onChange={(event) => handleFileChange("audio", event, false)}/>
                                </label>
                                <div>
                                    {question.audio.length > 0 && <p>{question.audio.length} audio files uploaded</p>}
                                </div>
                            </div>
                            <label className="input input-bordered flex items-center gap-4 mb-2 w-full">
                                <span className="label-text font-bold">Worth</span>
                                <input type="number" className="grow spinner text-end no-spinner" value={question.worth} min="0" onChange={(event) => setQuestionOption("worth", parseInt(event.target.value))}/>
                                <span>$</span>
                            </label>
                            <select className="select select-bordered w-full mb-2" defaultValue={question.questionType} onChange={(event) => setQuestionOption("questionType", event.target.value)}>
                                <option disabled value={"default"} className="font-bold">Question type</option>
                                <option value="buzzer">Buzzer</option>
                                <option disabled value="guess">Guess</option>
                                <option disabled value="comingsoon">More coming soon</option>
                            </select>
                            <label className="input input-bordered flex items-center gap-4 w-full">
                                <span className="label-text font-bold">Rounds locked</span>
                                <input type="number" className="grow spinner text-end no-spinner" value={question.isLockedForCount} min="0" max={getMaxLockCount()} onChange={(event) => setQuestionOption("isLockedForCount" , parseInt(event.target.value))}/>
                            </label>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-full flex-grow">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title mb-2">Answer</h2>
                            <textarea className="textarea textarea-bordered w-full" placeholder="Answer Text" value={answer.text} onInput={(event) => setAnswerOption("text", event.target.value)}/>
                            <div className="form-control w-full">
                                <label className="label cursor-pointer">
                                    <span className="label-text pr-4">Pictures</span>
                                    <input type="file" className={`file-input w-full max-w-lg ${answer.picture.length > 0 ? "file-input-success" : "file-input-bordered"}`} accept="image/*" onChange={(event) => handleFileChange("picture", event, true)}/>
                                </label>
                                <div className="flex gap-2 overflow-auto">
                                    {answer.picture.map((data, index) => {
                                        return <img key={index} src={data} alt={`answer-pic-${index}`} width="100" />
                                    })}
                                </div>
                            </div>
                            <div className="form-control w-full">
                                <label className="label cursor-pointer">
                                    <span className="label-text pr-4">Audios</span>
                                    <input type="file" className={`file-input w-full max-w-lg ${answer.audio.length > 0 ? "file-input-success" : "file-input-bordered"}`} accept="audio/*" onChange={(event) => handleFileChange("audio", event, true)}/>
                                </label>
                                <div>
                                    {answer.audio.length > 0 && <p>{answer.audio.length} audio files uploaded</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full modal-action">
                    <form method="dialog" className="w-full flex gap-8">
                        <button className="btn btn-primary flex-grow" onClick={handleSubmit}>Save</button>
                        <button className="btn btn-primary" onClick={handleClose}>Dismiss</button>
                        <button className="btn btn-error" onClick={handleClear}>Clear</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

EditQuestionAnswerModal.propTypes = {
    modalIndex: PropTypes.number,
    categoryIndex: PropTypes.number,
    questionIndex: PropTypes.number
};

export default EditQuestionAnswerModal