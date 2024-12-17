import { sendUpdates, doesRoomExist, isHostOfRoom, addToSkippingPlayers, hasRoomActiveQuestion, checkActiveQuestionType, isSkippingPlayer, buzzedBefore, removeFromSkippingPlayers, getCurrentRoomOfUserID } from "../utils/quizbattleUtils.js";

export default (socket) => {
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
    if (!checkActiveQuestionType(roomID, "buzzer")) {
        socket.emit("sendError", { error: "This is not a buzzer question."});
        return
    }
    if (buzzedBefore(socket.user.userID, roomID)) {
        return
    }
    if (isSkippingPlayer(socket.user.userID, roomID)) {
        removeFromSkippingPlayers(socket.user.userID, roomID);
    } else {
        addToSkippingPlayers(socket.user.userID, socket.user.username, roomID);
    }
    sendUpdates(roomID);
};
