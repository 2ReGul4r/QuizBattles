import { logData } from "../utils/quizbattleUtils.js";

export default async (socket, callback) => {
    if(!socket.user.isAdmin) {
        return
    }
    callback(logData());
};
