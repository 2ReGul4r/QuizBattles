import { doesRoomExist, logData, isRoomFull, joinToRoom, getRoomState, sendUpdates, setActivePlayer } from "../utils/quizbattleUtils.js";

export default async (socket, roomID, callback) => {
    if (!(doesRoomExist(roomID))) { //If room does not exist
        socket.emit("sendError", { error: "This room does not exist."});
        logData();
        return
    }
    if (isRoomFull(roomID)) {
        socket.emit("sendError", { error: "This room is full."});
        return
    }
    joinToRoom(socket, socket.user.userID, roomID, false);
    await callback(true, roomID);

    socket.on("joinNavigationComplete", (roomID) => {
        const roomState = getRoomState(roomID);
        const activePlayerUserID = Object.keys(roomState.players)[0];
        if (roomState.activePlayer.userID === null) setActivePlayer(activePlayerUserID, roomID);
        sendUpdates(roomID);
     });
} 