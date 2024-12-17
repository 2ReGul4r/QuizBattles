import { useUser } from "../contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersBetweenLines } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../contexts/SocketContext";
import { useEffect } from "react";

const NavBar = () => {
    const { userState } = useUser();
    const { socket } = useSocketContext();
    const { handleLogout } = useUser();
    const navigate = useNavigate();

      useEffect(() => {
        if (!socket) {
            return
        }
        window.quizBattles = {
          setQBState: (roomID, state) => {
            socket.emit("debugSetRoomState", roomID, state);
          }
        }
      }, [socket])

    const handleHomeNavigate = () => {
        navigate("/");
    };

    const clickLogin = () => {
        navigate("/login");
    };

    const clickSignUp = () => {
        navigate("/signup");
    };

    const handleLogData = () => {
        socket.emit("debugLogData", (data) => {
            Object.entries(data).map(([key, value]) => {
                console.log(key, value);
            });
        });
    };

    return (
        <div className="navbar navbar-position w-full bg-base-300">
            <div className="navbar-start">
                <div>
                    <a className="btn btn-ghost w-" onClick={handleHomeNavigate}>Home</a>
                </div>
            </div>
            <div className="navbar-center">
                <img
                    className="mi:flex hidden w-12 h-12 rarity-Legendary hover:cursor-pointer"
                    alt="QuizBattles Logo"
                    src="/QuizBattles.png"
                    onClick={handleHomeNavigate}
                />
                <a className="text-xl font-semibold cursor-pointer" onClick={handleHomeNavigate}>QuizBattles</a>
            </div>
            <div className="navbar-end">
                {userState.userID ? (
                    <div className="dropdown dropdown-end dropdown-hover">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                            <div className="bg-neutral text-neutral-content w-12 rounded-full">
                                <span>{userState.username.slice(0, 2)}</span>
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu dropdown-content bg-base-200 rounded-box z-10 w-52 p-2 shadow">
                            {userState.isAdmin && <li className="text-purple-500"><a className="btn btn-ghost" onClick={handleLogData}>Debug: Log Data</a></li>}
                            <li className="text-red-600"><a className="btn btn-ghost" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                ): (
                    <div>
                        <div className="hidden sm:flex">
                            <a className="btn btn-ghost" onClick={clickLogin}>Login</a>
                            <a className="btn btn-ghost" onClick={clickSignUp}>Register</a>
                        </div>
                        <div className="sm:hidden">
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                    <FontAwesomeIcon icon={faUsersBetweenLines} />
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-10 w-52 p-2 shadow">
                                    <li><a onClick={clickLogin}>Login</a></li>
                                    <li><a onClick={clickSignUp}>Register</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavBar
