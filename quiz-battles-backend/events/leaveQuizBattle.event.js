import { removePlayerFromRoom, isUserInARoom, mapRoomStateToGameState, getRoomState } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default async (socket, roomID) => {
    //TODO: Clean this
    if (!isUserInARoom(socket, socket.user.userID)) {
        socket.emit("sendError", { error: "You are not in a game."});
        return
    }   
    removePlayerFromRoom(socket, socket.user.userID, roomID);
    
    socket.on("navigationComplete", async () => {
        const roomState = getRoomState(roomID)
        const playersOfRoom = roomState.players;
        const gameState = await mapRoomStateToGameState(roomState)
        io.to(userRoomID).emit("gameStateUpdate", gameState);
        io.to(userRoomID).emit("playersRoomUpdate", playersOfRoom);
    })
}