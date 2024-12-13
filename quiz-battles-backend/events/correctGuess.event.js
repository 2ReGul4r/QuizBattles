import { getCurrentRoomOfUserID, doesRoomExist, isHostOfRoom, isUserInThisRoom, hasRoomActiveQuestion, checkActiveQuestionType, markGuessAsCorrect, sendUpdates } from "../utils/quizbattleUtils.js";

export default (socket, userID) => {
    const roomID = getCurrentRoomOfUserID(socket.user.userID);
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are not the host of this game."});
        return
    }
    if (isHostOfRoom(userID, roomID)) {
        socket.emit("sendError", { error: "This user is the host of the game."});
        return
    }
    if (!isUserInThisRoom(userID, roomID)) {
        socket.emit("sendError", { error: "This user is not in your game."});
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
    markGuessAsCorrect(userID, roomID);
    sendUpdates(roomID);
};
