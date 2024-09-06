import { GameContextProvider } from "../contexts/GameContext";
import { useLocation } from "react-router-dom";
import Game from "./Game";

const GameWrapper = () => {
    const location = useLocation();
    const { lobbyCode = "", roomState = {} } = location.state || {};
    return (
        <GameContextProvider lobbyCode={lobbyCode} roomState={roomState}>
            <Game />
        </GameContextProvider>
    )
}

export default GameWrapper