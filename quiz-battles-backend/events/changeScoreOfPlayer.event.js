import { doesRoomExist, isHostOfRoom, setScoreOfPlayer, sendUpdates } from "../utils/quizbattleUtils.js";

export default (socket, roomID, changeScoreState) => {
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    if (!isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are the host of this game."});
        return
    }
    const {userID, score, username} = changeScoreState;
    setScoreOfPlayer(userID, roomID, score);
    sendUpdates(roomID);
}