import { doesRoomExist, isRoomFull, joinToRoom, getRoomState, mapRoomStateToGameState, setActivePlayer } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default async (socket, roomID, callback) => {
    if (!(doesRoomExist(roomID))) { //If room does not exist
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (isRoomFull(roomID)) {
        socket.emit("sendError", { error: "This room is full."});
        return
    }
    joinToRoom(socket, socket.user.userID, roomID, false);
    await callback(true, roomID);

    socket.on("joinNavigationComplete", () => {
        const roomState = getRoomState(roomID);
        const activePlayerUserID = Object.keys(roomState.players)[0];
        if (roomState.activePlayer.userID === undefined) setActivePlayer(activePlayerUserID, roomID);
        const gameState = mapRoomStateToGameState(roomState);
        io.to(roomID).emit("gameStateUpdate", gameState);
     });
} 