import { useState } from "react";
import { useLocation } from "react-router-dom";

import CreateQuizPagesWrapper from "../components/CreateQuizPagesWrapper";
import { QuizBattleProvider } from "../contexts/CreateQuizBattleContext";

const CreateQuizBattle = () => {
  const minPages = 1;
  const maxPages = 3;
  const [page, setPage] = useState(minPages);
  const location = useLocation();
  const { initialQuizBattleID } = location.state || {};

  const handlePageChange = (newPage) => {
    if (newPage < minPages) {
      handlePageHighlighting(minPages);
      setPage(minPages);
    } else if (newPage > maxPages) {
      handlePageHighlighting(maxPages);
      setPage(maxPages);
    } else {
      handlePageHighlighting(newPage);
      setPage(newPage);
    }
  };

  const handlePageHighlighting = (number) =>{
    Array.from(document.getElementById("pagination_list").children).forEach((el) => {
      el.classList.remove("step-primary");
    });
    Array.from(document.getElementById("pagination_list").children).slice(0, number).forEach((el) => {
      el.classList.add("step-primary");
    });
  };

  return (
    <QuizBattleProvider initialQuizBattleID={initialQuizBattleID}>
      <div className="flex flex-col mb-32">
        <ul id="pagination_list" className="steps mb-8 steps-horizontal">
          <li className="step step-primary cursor-pointer" onClick={() => handlePageChange(1)}>Quiz Settings</li>
          <li className="step cursor-pointer" onClick={() => handlePageChange(2)}>Battle Settings</li>
          <li className="step cursor-pointer" onClick={() => handlePageChange(3)}>Board</li>
        </ul>
        <CreateQuizPagesWrapper page={page}/>
        <div className="join self-center fixed bottom-8">
          <button className="join-item btn bg-base-300" onClick={() => handlePageChange(page - 1)}>«</button>
          <button className="join-item px-4 bg-base-300">Page {page}</button>
          <button className="join-item btn bg-base-300" onClick={() => handlePageChange(page + 1)}>»</button>
        </div>
      </div>
    </QuizBattleProvider>
  )
};

export default CreateQuizBattle;