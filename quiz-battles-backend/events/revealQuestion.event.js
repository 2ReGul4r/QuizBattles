import { sendUpdates, doesRoomExist, hasRoomActiveQuestion, isHostOfRoom, setActiveQuestion, resetActiveAnswer, setHasActiveQuestion, checkActiveQuestionType, setActiveGuessInput } from "../utils/quizbattleUtils.js";
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
    setHasActiveQuestion(roomID, true);
    resetActiveAnswer(roomID);
    setActiveQuestion(categoryIndex, questionIndex, roomID);
    if (checkActiveQuestionType(roomID, "guess")) {
        setActiveGuessInput(roomID, true);
    }
    sendUpdates(roomID);
    io.to(roomID).emit("markedQuestion", -1);
};
