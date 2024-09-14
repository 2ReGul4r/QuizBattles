import { getRoomState, mapRoomStateToGameState, doesRoomExist, hasRoomActiveQuestion, isHostOfRoom, setActiveQuestion, resetActiveAnswer, checkHasActiveQuestion } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default (socket, categoryIndex, questionIndex, roomID) => {
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are not the host of this game."});
        return
    }
    if (hasRoomActiveQuestion(roomID)) {
        socket.emit("sendError", { error: "There is already an active question."});
        return
    }
    resetActiveAnswer(roomID);
    setActiveQuestion(categoryIndex, questionIndex, roomID);
    checkHasActiveQuestion(roomID);
    const roomState = getRoomState(roomID);
    const gameState = mapRoomStateToGameState(roomState)
    io.to(roomID).emit("gameStateUpdate", gameState);
    io.to(roomID).emit("markedQuestion", -1);
}