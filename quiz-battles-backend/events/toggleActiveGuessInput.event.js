import { getCurrentRoomOfUserID, doesRoomExist, isHostOfRoom, hasRoomActiveQuestion, checkActiveQuestionType, toggleActiveGuessInput, sendUpdates } from "../utils/quizbattleUtils.js";

export default (socket) => {
    const roomID = getCurrentRoomOfUserID(socket.user.userID);
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
    if (!checkActiveQuestionType(roomID, "guess")) {
        socket.emit("sendError", { error: "This is not a guess question."});
        return
    }
    toggleActiveGuessInput(roomID);
    sendUpdates(roomID);
};
