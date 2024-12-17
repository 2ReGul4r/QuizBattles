import { markBuzzerAsCorrect, checkActiveQuestionType, hasRoomActiveBuzzer, sendUpdates, doesRoomExist, hasRoomActiveQuestion, isHostOfRoom, setHasActiveQuestion, getCurrentRoomOfUserID } from "../utils/quizbattleUtils.js";

export default (socket) => {
    const roomID = getCurrentRoomOfUserID(socket.user.userID);
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
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
    if (!hasRoomActiveBuzzer(roomID)) {
        return
    }
    markBuzzerAsCorrect(roomID);
    setHasActiveQuestion(roomID, false);
    sendUpdates(roomID);
};
