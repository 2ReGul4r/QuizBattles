import handleJoinQuizBattle from "./joinQuizBattle.event.js";
import handleHostQuizBattle from "./hostQuizBattle.event.js";
import handleLeaveQuizBattle from "./leaveQuizBattle.event.js";
import handleKickPlayer from "./kickPlayer.event.js";
import handleIsRoomExisting from "./isRoomExisting.event.js";
import handleMarkQuestion from "./markQuestion.event.js"

import { verifyJWT, tryToReconnect } from "../utils/quizbattleUtils.js";

const verifySocketJWT = (socket, next) => {
    const decoded = verifyJWT(socket.handshake.auth.token);
    if (!decoded) {
        socket.emit("sendError", { error: "Invalid or missing token" });
        return
    }
    socket.user = decoded;
    next();
};

export const handleQuizBattleEvents = (socket) => {
    verifySocketJWT(socket, () => {
        tryToReconnect(socket);
        socket.on("hostQuizBattle", (quizbattleID, callback) => handleHostQuizBattle(socket, quizbattleID, callback));
        socket.on("joinQuizBattle", (roomID, callback) => handleJoinQuizBattle(socket, roomID, callback));
        socket.on("leaveGame", (roomID) => handleLeaveQuizBattle(socket, roomID));
        socket.on("kickPlayer", (userID, roomID, callback) => handleKickPlayer(socket, userID, roomID, callback));
        socket.on("isRoomExisting", (roomID) => handleIsRoomExisting(socket, roomID));
        socket.on("markQuestion", (index, roomID) => handleMarkQuestion(socket, index, roomID));
        socket.on("tryToReconnect", () => tryToReconnect(socket));
    });
};
