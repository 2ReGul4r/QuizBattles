import { getRoomState, mapRoomStateToGameState, doesRoomExist, isHostOfRoom, resetActiveQuestion, resetActiveAnswer, checkHasActiveQuestion } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default (socket, roomID) => {
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are not the host of this game."});
        return
    }
    resetActiveAnswer(roomID);
    resetActiveQuestion(roomID);
    checkHasActiveQuestion(roomID);
    const roomState = getRoomState(roomID);
    const gameState = mapRoomStateToGameState(roomState)
    io.to(roomID).emit("gameStateUpdate", gameState);
}