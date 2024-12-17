import { createNewQuizBattleRoom, sendUpdates, sendRoomStateToHost, setRoomState, getCurrentRoomOfUserID, tryToReconnect } from "../utils/quizbattleUtils.js";

export default async (socket, quizbattleID, callback) => {
    if (getCurrentRoomOfUserID(socket.user.userID)) {
        tryToReconnect(socket);
        return
    }
    const newRoomState = await createNewQuizBattleRoom(socket, quizbattleID);
    const roomID = newRoomState.roomID;
    setRoomState(roomID, newRoomState);
    socket.join(roomID);
    callback(roomID);

    socket.on("hostNavigationComplete", () => {
        sendUpdates(roomID);
        sendRoomStateToHost(roomID);
    });
};
