import { setQuestionIsAnswered, sendUpdates, doesRoomExist, hasRoomActiveQuestion, isHostOfRoom, cleanUpActives } from "../utils/quizbattleUtils.js";

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
    cleanUpActives(roomID);
    setQuestionIsAnswered(categoryIndex, questionIndex, roomID, true);
    sendUpdates(roomID);
};
