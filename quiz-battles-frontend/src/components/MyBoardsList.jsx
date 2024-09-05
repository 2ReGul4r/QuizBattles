import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBoards, deleteBoard } from "../services/board.service.jsx";
import { useNavigate } from "react-router-dom";

const MyBoardsList = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchBoards = async () => {
        try {
          const response = await getBoards();
          if (Array.isArray(response)) {
            setBoards(response);
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate("/create", { state: { initialBoardID: id }})
    };

    const handleDelete = async (id) => {
        const response = await deleteBoard(id);
        console.log(response)
        if (response.deletedCount > 0) {
            toast.success("QuizBattle was deleted");
            fetchBoards();
        }
    };
  
    useEffect(() => {
      fetchBoards();
    }, []);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  
    return (
        <div className="w-full">
            {boards.length > 0 && (<div className="card bg-base-200 shadow-xl items-center text-center basis-full overflow-x-auto">
                <div className="card-body w-full overflow-x-auto">
                    <h2 className="card-title self-center pb-4">My QuizBattles</h2>
                    {boards.map(board => (
                    <div key={board._id} className="card w-full bg-base-100 shadow-xl [&:not(:last-child)]:mb-8">
                        <div className="card-body flex-col sm:flex-row items-center justify-between overflow-x-auto">
                        <div className="tooltip contents before:max-w-full" data-tip={board.name}>
                            <h2 className="card-title overflow-hidden w-1/4">{board.name}</h2>
                        </div>
                        <p>Created at: {new Date(board.createdAt).toLocaleDateString("de-DE")} {new Date(board.createdAt).toLocaleTimeString("de-DE")}</p>
                        <p>Last Updates at: {new Date(board.updatedAt).toLocaleDateString("de-DE")} {new Date(board.createdAt).toLocaleTimeString("de-DE")}</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary flex-grow" onClick={() => handleEdit(board._id)}>Edit</button>
                            <button className="btn btn-primary flex-grow" onClick={()=>document.getElementById(`delete_quizbattle_modal_${board._id}`).showModal()}>Delete</button>
                            <dialog id={`delete_quizbattle_modal_${board._id}`} className="modal p-8">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg pb-4">Are you sure?</h3>
                                    <p className="pb-4">Are you sure you want to delete</p>
                                    <p className="overflow-x-auto pb-2">{board.name}</p>
                                    <div className="modal-action">
                                    <form method="dialog" className="flex flex-grow gap-4">
                                        <button className="btn flex-grow" onClick={() => handleDelete(board._id, board.name)}>Yes</button>
                                        <button className="btn flex-grow">No</button>
                                    </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>)}
        </div>
    )
};

export default MyBoardsList;
