import { doesRoomExist, isRoomFull, joinToRoom, getRoomState, mapRoomStateToGameState } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default async (socket, roomID, callback) => {
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

    socket.on("navigationComplete", async () => {
        const roomState = getRoomState(roomID)
        const playersOfRoom = roomState.players;
        const gameState = await mapRoomStateToGameState(roomState)
        io.to(roomID).emit("gameStateUpdate", gameState);
        io.to(roomID).emit("playersRoomUpdate", playersOfRoom);
     });
} 