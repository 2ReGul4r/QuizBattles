import { isUserInThisRoom, isHostOfRoom, isActivePlayer, hasRoomActiveQuestion, getCurrentRoomOfUserID } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default (socket, index) => {
    const roomID = getCurrentRoomOfUserID(socket.user.userID);
    if (isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are the host of this game."});
        return
    }
    if (!isActivePlayer(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "Its not your turn."});
        return
    }
    if (hasRoomActiveQuestion(roomID)) {
        socket.emit("sendError", { error: "There is an ongoing Question."});
        return
    }
    io.to(roomID).emit("markedQuestion", index);
};
