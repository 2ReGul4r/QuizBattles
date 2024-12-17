import { isActiveQuizBattleHost, isUserInThisRoom, isHostOfRoom, getUserSocket, removePlayerFromRoom, sendUpdates, getCurrentRoomOfUserID } from "../utils/quizbattleUtils.js";

export default (socket, userID, callback) => {
    const roomID = getCurrentRoomOfUserID(socket.user.userID);
    if (!isActiveQuizBattleHost(socket.user.userID)) {
        socket.emit("sendError", { error: "You do not host a game."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "This is not your game."});
        return
    }
    if (!isUserInThisRoom(userID, roomID)) {
        socket.emit("sendError", { error: "This user is not in your game."});
        return
    }
    const userSocket = getUserSocket(userID, roomID);
    if (!userSocket) {
        socket.emit("sendError", { error: "This user is not connected."});
        return
    }
    removePlayerFromRoom(userSocket, userID, roomID, true, "Your were kicked from this game");
    sendUpdates(roomID);
    callback(true);
};
