import handleJoinQuizBattle from "./joinQuizBattle.event.js";
import handleHostQuizBattle from "./hostQuizBattle.event.js";
import handleLeaveQuizBattle from "./leaveQuizBattle.event.js";
import handleKickPlayer from "./kickPlayer.event.js";
import handleReconnect from "./reconnect.event.js";
import handleIsRoomExisting from "./isRoomExisting.event.js";

import { verifyJWT } from "../utils/quizbattleUtils.js";

export const quizBattleState = {};

export const userIDRoomIDMap = new Map();
export const hostIDRoomIDMap = new Map();

export const maxPlayers = 12;

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
        handleReconnect(socket);
        socket.on("hostQuizBattle", (quizbattleID, callback) => handleHostQuizBattle(socket, quizbattleID, callback));
        socket.on("joinQuizBattle", (roomID, callback) => handleJoinQuizBattle(socket, roomID, callback));
        socket.on("leaveGame", (roomID) => handleLeaveQuizBattle(socket, roomID));
        socket.on("kickPlayer", (userID, roomID, callback) => handleKickPlayer(socket, userID, roomID, callback));
        socket.on("isRoomExisting", (roomID) => handleIsRoomExisting(socket, roomID));
    });
};
