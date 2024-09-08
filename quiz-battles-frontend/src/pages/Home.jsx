import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MyQuizBattlesList from "../components/MyQuizBattlesList";
import { useSocketContext } from "../contexts/SocketContext";
import toast from "react-hot-toast";

const Home = () => {
  const { userState } = useUser();
  const navigate = useNavigate();
  const [joinRoomID, setJoinRoomID] = useState("")
  const { socket } = useSocketContext();

  const handleJoinGame = () => {
    socket.emit("joinQuizBattle", joinRoomID, async (joinedRoomSuccessfully, roomID) => {
      if(joinedRoomSuccessfully) {
        await navigate("/game", { state: { roomID }});
        socket.emit("joinNavigationComplete");
      } else {
        toast.error("Could not join room.")
      }
    })
  }

  const handleJoinRoomChange = (event) => {
    const value = event.target.value;
    const upperValue = value.toUpperCase();
    const cleanValue = upperValue.replace(/[^A-Z0-9]/g, '');
    setJoinRoomID(cleanValue);
  }

  return (
    <div className="flex items-stretch flex-wrap gap-8 mx-6 justify-center flex-row">
      <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-60">
        <div className="card-body w-full">
          <h2 className="card-title self-center pb-4">Join a Game</h2>
            <input type="text" placeholder="Gamecode" value={joinRoomID} onChange={handleJoinRoomChange} className="input input-bordered w-full mb-4"></input>
          <div className="card-actions justify-end">
            <button className="btn btn-primary w-full" onClick={handleJoinGame}>Join Now</button>
          </div>
        </div>
      </div>
      <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-60">
        <div className="card-body w-full">
          <h2 className="card-title self-center pb-4">Create a QuizBattle</h2>
          <p className="pb-4">Here you can create your own QuizBattle.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary w-full" onClick={() => navigate("/create")}>Create Now</button>
          </div>
        </div>
      </div>
      <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-60">
        <div className="card-body w-full">
          <h2 className="card-title self-center pb-4">Host your Game</h2>
          <p className="pb-4">Your QuizBattle is ready and you want to play.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary w-full" onClick={() => navigate("/host")}>Play Now</button>
          </div>
        </div>
      </div>
      {!userState.userID && 
        <div className="card bg-base-200 shadow-xl items-center text-center basis-full">
          <div className="card-body">
            <h2 className="card-title self-center pb-4">Please login</h2>
            <p className="pb-4">You can only create a Quiz with if you are logged in!</p>
            <div className="card-actions justify-evenly">
              <button className="btn btn-primary self-start flex-grow" onClick={() => navigate("/signup")}>Signup</button>
              <button className="btn btn-primary self-end flex-grow" onClick={() => navigate("/login")}>Login</button>
            </div>
          </div>
        </div>
      }
      {userState.userID &&
        <MyQuizBattlesList />
      }
    </div>
  )
}

export default Home