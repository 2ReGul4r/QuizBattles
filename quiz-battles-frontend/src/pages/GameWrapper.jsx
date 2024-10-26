import { GameContextProvider } from "../contexts/GameContext";
import { useLocation } from "react-router-dom";
import Game from "./Game";

const GameWrapper = () => {
    const location = useLocation();
    const { roomID = "", roomState = {} } = location.state || {};
    return (
        <GameContextProvider roomID={roomID} initRoomState={roomState}>
            <Game />
        </GameContextProvider>
    )
}

export default GameWrapper