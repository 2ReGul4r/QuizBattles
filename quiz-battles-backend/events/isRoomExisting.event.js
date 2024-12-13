import { doesRoomExist } from "../utils/quizbattleUtils.js";

export default (socket, roomID) => {
    const isRoomExisting = doesRoomExist(roomID);
    if (!isRoomExisting) socket.emit("redirectToHome");
};
