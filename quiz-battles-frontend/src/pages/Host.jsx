import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getQuizBattles } from "../services/quizbattles.service.jsx";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../contexts/SocketContext.jsx";

const Host = () => {
    const [quizbattles, setQuizBattles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { socket } = useSocketContext();

    const fetchQuizBattles = async () => {
        try {
          const response = await getQuizBattles();
          if (Array.isArray(response)) {
            setQuizBattles(response);
          } else {
            throw new Error("There was an error getting your QuizBattles");
          }
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
    };

    const handleHost = (id) => {
        socket.emit("hostQuizBattle", { quizbattleID: id }, (response) => {
            console.log(response)
            if(response) {
                navigate("/game", { state: { lobbyCode: response.lobbyID, roomState: response.roomState }})
            }
        });
    };
  
    useEffect(() => {
      fetchQuizBattles();
    }, []);
  
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center basis-full m-8">
                <p className="text-2xl mb-4">Loading...</p>
                <progress className="progress progress-primary w-96" />
            </div>
        );
    }
    if (error) {
        toast.error(error.message);
        navigate("/");
        return (<div></div>);
    }
  
    return (
        <div className="w-full">
            {quizbattles.length > 0 && (<div className="card bg-base-200 shadow-xl items-center text-center basis-full overflow-x-auto">
                <div className="card-body w-full overflow-x-auto">
                    <h2 className="card-title self-center pb-4">My QuizBattles</h2>
                    {quizbattles.map(quizbattle => (
                    <div key={quizbattle._id} className="card w-full bg-base-100 shadow-xl [&:not(:last-child)]:mb-8">
                        <div className="card-body flex-col sm:flex-row items-center justify-between overflow-x-auto">
                        <div className="tooltip contents before:max-w-full" data-tip={quizbattle.name}>
                            <h2 className="card-title overflow-hidden w-1/4">{quizbattle.name}</h2>
                        </div>
                        <p>Created at: {new Date(quizbattle.createdAt).toLocaleDateString("de-DE")} {new Date(quizbattle.createdAt).toLocaleTimeString("de-DE")}</p>
                        <p>Last Updates at: {new Date(quizbattle.updatedAt).toLocaleDateString("de-DE")} {new Date(quizbattle.createdAt).toLocaleTimeString("de-DE")}</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary flex-grow w-full" onClick={() => handleHost(quizbattle._id)}>Play</button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>)}
        </div>
    )
};

export default Host
