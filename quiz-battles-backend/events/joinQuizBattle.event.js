import { doesRoomExist, isRoomFull, joinToRoom, getRoomState, sendUpdates, setActivePlayer, getCurrentRoomOfUserID, tryToReconnect } from "../utils/quizbattleUtils.js";

export default async (socket, roomID, callback) => {
    if (getCurrentRoomOfUserID(socket.user.userID)) {
        tryToReconnect(socket);
        return
    }
    if (!(doesRoomExist(roomID))) { //If room does not exist
        socket.emit("sendError", { error: "This room does not exist."});
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
};
