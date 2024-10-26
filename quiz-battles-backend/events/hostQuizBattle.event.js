import { createNewQuizBattleRoom, sendUpdates, sendRoomStateToHost, setRoomState } from "../utils/quizbattleUtils.js";

export default async (socket, quizbattleID, callback) => {
    const { roomID, newRoomState } = await createNewQuizBattleRoom(socket, quizbattleID);
    setRoomState(roomID, newRoomState);
    socket.join(roomID);
    callback(roomID);

    socket.on("hostNavigationComplete", () => {
        sendUpdates(roomID);
        sendRoomStateToHost(roomID);
    });
};
