import { sendUpdates, doesRoomExist, isHostOfRoom, setActiveBuzzer, hasRoomActiveQuestion, checkActiveQuestionType, hasRoomActiveBuzzer, buzzedBefore, removeFromSkippingPlayers } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

let buzzerEvents = [];
let buzzerTimeout = null;

export default (socket, roomID, callback) => {
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
    if (hasRoomActiveBuzzer(roomID)) {
        return
    }
    if (buzzedBefore(socket.user.userID, roomID)) {
        return
    }
    const alreadyBuzzed = buzzerEvents.some(event => event.userID === socket.user.userID);
    if (alreadyBuzzed) {
        return
    }
    removeFromSkippingPlayers(socket.user.userID, roomID);
    const serverTime = Date.now();
    const pingToSocket = socket?.conn?.transport?.latency || 0;
    const correctedBuzzTime = serverTime - pingToSocket;
    buzzerEvents.push({ userID: socket.user.userID , username: socket.user.username, correctedBuzzTime });
    callback();

    if (!buzzerTimeout) {
        buzzerTimeout = setTimeout(() => {
            if (buzzerEvents.length > 0) {
                buzzerEvents.sort((a, b) => a.correctedBuzzTime - b.correctedBuzzTime);
                const firstBuzz = buzzerEvents[0];
                setActiveBuzzer(firstBuzz.userID, firstBuzz.username, firstBuzz.correctedBuzzTime, roomID);
                sendUpdates(roomID);
                io.to(roomID).emit("buzzerResults", buzzerEvents);
            }
            buzzerEvents = [];
            buzzerTimeout = null;
        }, 1000);
    }
};
