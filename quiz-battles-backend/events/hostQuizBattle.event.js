import { createNewQuizBattleRoom, mapRoomStateToGameState, getRoomState, setRoomState } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default async (socket, quizbattleID, callback) => {
    const { roomID, newRoomState } = await createNewQuizBattleRoom(socket, quizbattleID);
    setRoomState(roomID, newRoomState);
    socket.join(roomID);
    callback(roomID, newRoomState);

    socket.on("navigationComplete", async () => {
        const currentRoomState = getRoomState(roomID);
        if (!currentRoomState) {
            //TODO: delete room here
            return 
        }
        const gameState = await mapRoomStateToGameState(currentRoomState);
        io.to(roomID).emit("gameStateUpdate", gameState);
        socket.emit("setHostState", currentRoomState);
    })
}