import { getRoomState, doesRoomExist, hasRoomActiveQuestion, isHostOfRoom, setActiveAnswer, setActiveQuestion, resetActiveAnswer, resetActiveQuestion, checkHasActiveQuestion, sendUpdates } from "../utils/quizbattleUtils.js";

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
    const roomState = getRoomState(roomID);
    if (!!Object.keys(roomState.activeQuestion).length) {
        resetActiveQuestion(roomID);
        setActiveAnswer(categoryIndex, questionIndex, roomID);
    } else if (!!Object.keys(roomState.activeAnswer).length) {
        resetActiveAnswer(roomID);
        setActiveQuestion(categoryIndex, questionIndex, roomID);
    }
    checkHasActiveQuestion(roomID);
    sendUpdates(roomID);
};
