import { getRoomState, doesRoomExist, isHostOfRoom, setActiveAnswer, setActiveQuestion, resetActiveAnswer, resetActiveQuestion, sendUpdates, getCurrentRoomOfUserID } from "../utils/quizbattleUtils.js";

export default (socket, categoryIndex, questionIndex) => {
    const roomID = getCurrentRoomOfUserID(socket.user.userID);
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are not the host of this game."});
        return
    }
    const roomState = getRoomState(roomID);
    if (!!Object.keys(roomState.activeQuestion).length) {
        resetActiveQuestion(roomID);
        setActiveAnswer(categoryIndex, questionIndex, roomID);
    } else if (!!Object.keys(roomState.activeAnswer).length) {
        resetActiveAnswer(roomID);
        setActiveQuestion(categoryIndex, questionIndex, roomID);
    }
    sendUpdates(roomID);
};
