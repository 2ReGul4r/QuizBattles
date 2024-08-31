import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faI, faImage, faMusic } from "@fortawesome/free-solid-svg-icons";


const Board = (quizState) => {
    if (Object.keys(quizState).length <= 0) {
        return <div>Loading...</div>;
    }
    return (
        <div className="grid gap-8" style={{gridTemplateColumns: `repeat(${quizState.options.quiz.categoryCount}, 1fr)`}}>
            {quizState.categories.map((category, index) => (
                <div key={index} className="">
                <div className="card bg-base-200 shadow-xl mb-8"><div className="card-body"><h2 className="card-title self-center">{category.title}</h2></div></div>
                {category.questions.map((question, qIndex) => (
                    <div key={qIndex} className="card bg-base-200 shadow-xl mb-8">
                        <div className="card-body">
                            <h2 className="card-title self-center">{question.worth}</h2>
                            {(question.hasPicture || question.hasAudio) && (
                                <div className="card-actions justify-end">
                                    {question.hasPicture && <div className="badge badge-primary"><FontAwesomeIcon icon={faImage} />Picture</div>}
                                    {question.hasAudio && <div className="badge badge-secondary"><FontAwesomeIcon icon={faMusic} />Audio</div>}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                </div>
            ))}
        </div>
    )
}

export default Board