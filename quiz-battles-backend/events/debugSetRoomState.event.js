import { setRoomState, sendUpdates } from "../utils/quizbattleUtils.js";

export default async (socket, roomID, state) => {
    if(!socket.user.isAdmin) {
        return
    }
    setRoomState(roomID, state);
    sendUpdates(roomID);
};
