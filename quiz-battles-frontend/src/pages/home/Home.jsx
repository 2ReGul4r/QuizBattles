import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { state } = useUser();
  const navigate = useNavigate();

  const handleLoginNavigate = () => {
    navigate("/login");
}

  return (
    <div className="flex items-stretch flex-wrap gap-8 mx-6 justify-center flex-row">
      <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-60">
        <div className="card-body">
          <h2 className="card-title self-center pb-4">Join a Game</h2>
            <input type="text" placeholder="Gamecode" className="input input-bordered w-full max-w-xs mb-4"></input>
          <div className="card-actions justify-end">
            <button className="btn btn-primary w-full">Join Now</button>
          </div>
        </div>
      </div>
      <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-60">
        <div className="card-body">
          <h2 className="card-title self-center pb-4">Create a QuizBattle</h2>
          <p className="pb-4">Here you can create your own QuizBattle-board.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary w-full">Create Now</button>
          </div>
        </div>
      </div>
      <div className="card bg-base-200 shadow-xl items-center text-center flex-grow basis-60">
        <div className="card-body">
          <h2 className="card-title self-center pb-4">Host your Game</h2>
          <p className="pb-4">Your board is ready and you want to play.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary w-full">Play Now</button>
          </div>
        </div>
      </div>
      {!state.userID && 
        <div className="card bg-base-200 shadow-xl items-center text-center basis-full">
          <div className="card-body">
            <h2 className="card-title self-center pb-4">Please login</h2>
            <p className="pb-4">You can only create a Quiz with if you are logged in!</p>
            <div className="card-actions justify-evenly">
              <button className="btn btn-primary self-start flex-grow">Signup</button>
              <button className="btn btn-primary self-end flex-grow" onClick={handleLoginNavigate}>Login</button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Home