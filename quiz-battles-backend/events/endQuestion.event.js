import { getRoomState, setQuestionIsAnswered, mapRoomStateToGameState, doesRoomExist, hasRoomActiveQuestion, isHostOfRoom, resetActiveQuestion, resetActiveAnswer, checkHasActiveQuestion } from "../utils/quizbattleUtils.js";
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
    if (!hasRoomActiveQuestion(roomID)) {
        socket.emit("sendError", { error: "There is not an active question."});
        return
    }
    resetActiveAnswer(roomID);
    resetActiveQuestion(roomID);
    checkHasActiveQuestion(roomID);
    setQuestionIsAnswered(categoryIndex, questionIndex, roomID, true);
    const roomState = getRoomState(roomID);
    const gameState = mapRoomStateToGameState(roomState)
    io.to(roomID).emit("gameStateUpdate", gameState);
}