import { createNewQuizBattleRoom, mapRoomStateToGameState, getRoomState, setRoomState } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export default async (socket, quizbattleID, callback) => {
    const { roomID, newRoomState } = await createNewQuizBattleRoom(socket, quizbattleID);
    setRoomState(roomID, newRoomState);
    socket.join(roomID);
    callback(roomID, newRoomState);

    socket.on("hostNavigationComplete", () => {
        const currentRoomState = getRoomState(roomID);
        if (!currentRoomState) {
            //TODO: delete room here
            return 
        }
        const gameState = mapRoomStateToGameState(currentRoomState);
        io.to(roomID).emit("gameStateUpdate", gameState);
    })
}