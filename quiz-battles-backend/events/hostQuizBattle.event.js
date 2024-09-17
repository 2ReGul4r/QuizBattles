import { createNewQuizBattleRoom, sendUpdates, setRoomState } from "../utils/quizbattleUtils.js";

export default async (socket, quizbattleID, callback) => {
    const { roomID, newRoomState } = await createNewQuizBattleRoom(socket, quizbattleID);
    setRoomState(roomID, newRoomState);
    socket.join(roomID);
    callback(roomID, newRoomState);

    socket.on("hostNavigationComplete", () => {
        sendUpdates(roomID);
    })
}