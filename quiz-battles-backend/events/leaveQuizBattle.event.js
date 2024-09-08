import { removePlayerFromRoom, isUserInARoom, mapRoomStateToGameState, getRoomState, isHostOfRoom, doesRoomExist, deleteRoom } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default async (socket, roomID) => {
    if (!isUserInARoom(socket, socket.user.userID) && !isHostOfRoom(socket.user.userID, roomID)) {
        socket.emit("sendError", { error: "You are not in a game."});
        return
    }
    if (!doesRoomExist(roomID)) {
        socket.emit("sendError", { error: "This room does not exist."});
        return
    }
    const isHost = isHostOfRoom(socket.user.userID, roomID);

    if (isHost) {
        deleteRoom(roomID);
    } else {
        removePlayerFromRoom(socket, socket.user.userID, roomID);
        const roomState = getRoomState(roomID)
        const playersOfRoom = roomState.players;
        const gameState = await mapRoomStateToGameState(roomState)
        io.to(roomID).emit("gameStateUpdate", gameState);
        io.to(roomID).emit("playersRoomUpdate", playersOfRoom);
    }
}