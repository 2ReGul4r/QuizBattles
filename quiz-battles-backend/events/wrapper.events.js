import handleJoinQuizBattle from "./joinQuizBattle.event.js";
import handleHostQuizBattle from "./hostQuizBattle.event.js";
import handleLeaveQuizBattle from "./leaveQuizBattle.event.js";
import handleKickPlayer from "./kickPlayer.event.js";
import handleIsRoomExisting from "./isRoomExisting.event.js";
import handleMarkQuestion from "./markQuestion.event.js";
import handleRevealQuestion from "./revealQuestion.event.js";
import handleRevealAnswer from "./revealAnswer.event.js";
import handleEndQuestion from "./endQuestion.event.js";
import handleToggleReveal from "./toggleReveal.event.js";
import handleBackToBoard from "./backToBoard.event.js";
import handleBuzzerPress from "./buzzerPress.event.js";
import handleSkippingPress from "./skippingPress.event.js";
import handleMarkBuzzerCorrect from "./correctBuzzerAnswer.event.js";
import handleMarkBuzzerWrong from "./wrongBuzzerAnswer.event.js";
import handleChangeScoreOfPlayer from "./changeScoreOfPlayer.event.js";

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
        socket.on("revealQuestion", (categoryIndex, questionIndex, roomID) => handleRevealQuestion(socket, categoryIndex, questionIndex, roomID));
        socket.on("revealAnswer", (categoryIndex, questionIndex, roomID) => handleRevealAnswer(socket, categoryIndex, questionIndex, roomID));
        socket.on("toggleReveal", (categoryIndex, questionIndex, roomID) => handleToggleReveal(socket, categoryIndex, questionIndex, roomID));
        socket.on("endQuestion", (roomID) => handleEndQuestion(socket, roomID));
        socket.on("backToBoard", (roomID) => handleBackToBoard(socket, roomID));
        socket.on("buzzerPress", (roomID, callback) => handleBuzzerPress(socket, roomID, callback));
        socket.on("correctBuzzerAnswer", (roomID) => handleMarkBuzzerCorrect(socket, roomID));
        socket.on("wrongBuzzerAnswer", (roomID) => handleMarkBuzzerWrong(socket, roomID));
        socket.on("skippingPress", (roomID) => handleSkippingPress(socket, roomID));
        socket.on("changeScoreOfPlayer", (roomID, changeScoreState) => handleChangeScoreOfPlayer(socket, roomID, changeScoreState));
        socket.on("tryToReconnect", () => tryToReconnect(socket));
    });
};
