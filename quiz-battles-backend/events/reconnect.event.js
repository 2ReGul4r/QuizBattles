import { getCurrentRoomOfUserID, doesRoomExist, isHostOfRoom, getRoomState, joinToRoom, mapRoomStateToGameState } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default (socket) => {
    const roomID = getCurrentRoomOfUserID(socket.user.userID);
    if (!roomID) return
    const existingRoom = doesRoomExist(roomID);
    if (!existingRoom) return
    const isHost = isHostOfRoom(socket.user.userID, roomID);
    joinToRoom(socket, socket.user.userID, roomID, isHost);
    socket.emit("redirectToRoom", roomID, async () => {
        const roomState = getRoomState(roomID);
        const playersOfRoom = roomState.players;
        const gameState = await mapRoomStateToGameState(roomState)
        io.to(roomID).emit("gameStateUpdate", gameState);
        io.to(roomID).emit("playersRoomUpdate", playersOfRoom);
        if (isHost) socket.emit("setHostState", roomState);
    });
}
