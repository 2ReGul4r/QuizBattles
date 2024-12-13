import { getCurrentRoomOfUserID, doesRoomExist, isHostOfRoom, hasRoomActiveQuestion, checkActiveQuestionType, isUserInThisRoom, hasRoomActiveGuessInput, overwriteCurrentGuess, sendUpdatesToHost } from "../utils/quizbattleUtils.js";

export default (socket, guessAnswer) => {
    const roomID = getCurrentRoomOfUserID(socket.user.userID);
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are the host of this game."});
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
    if (!isUserInThisRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "This user is not in your game."});
        return
    }
    if (!hasRoomActiveGuessInput(roomID)) {
        socket.emit("sendError", { error: "The inputs are locked."});
        return
    }
    overwriteCurrentGuess(socket.user.userID, socket.user.username, roomID, guessAnswer);
    sendUpdatesToHost(roomID);
};
