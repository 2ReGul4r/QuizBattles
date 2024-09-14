import { isActiveQuizBattleHost, isUserInThisRoom, isHostOfRoom, getUserSocket, removePlayerFromRoom, getRoomState, mapRoomStateToGameState } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default (socket, userID, roomID, callback) => {
    if (!isActiveQuizBattleHost) {
        socket.emit("sendError", { error: "You do not host a game."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "This is not your game."});
        return
    }
    if (!isUserInThisRoom(userID, roomID)) {
        socket.emit("sendError", { error: "This user is not in your game."});
        return
    }
    const userSocket = getUserSocket(userID, roomID);
    if (!userSocket) {
        socket.emit("sendError", { error: "This user is not connected."});
        return
    }
    removePlayerFromRoom(userSocket, userID, roomID, true, "Your were kicked from this game");

    const roomState = getRoomState(roomID);
    const gameState = mapRoomStateToGameState(roomState)
    io.to(roomID).emit("gameStateUpdate", gameState);
    callback(true);
}