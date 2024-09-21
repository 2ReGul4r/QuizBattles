import { sendUpdates, doesRoomExist, isHostOfRoom, resetActiveQuestion, setActiveAnswer } from "../utils/quizbattleUtils.js";

export default (socket, categoryIndex, questionIndex, roomID) => {
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are not the host of this game."});
        return
    }
    resetActiveQuestion(roomID);
    setActiveAnswer(categoryIndex, questionIndex, roomID);
    sendUpdates(roomID);
};
