import { cleanUpActives, doesRoomExist, isHostOfRoom, sendUpdates } from "../utils/quizbattleUtils.js";

export default (socket, roomID) => {
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are not the host of this game."});
        return
    }
    cleanUpActives(roomID);
    sendUpdates(roomID);
}