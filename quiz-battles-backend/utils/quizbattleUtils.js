import QuizBattle from "../models/quizbattle.model.js";
import jwt from "jsonwebtoken";
import { io } from "../socket/socket.js";
import { increasePlayersWonGames, increasePlayersGamesPlayed, increasePlayersHostedGames, increasePlayersBattlesWon, increasePlayersBattlesPlayed, addPlayersTotalScore } from "../controllers/playerActions.controller.js";

export const quizBattleState = {};

const userIDRoomIDMap = new Map();
const hostIDRoomIDMap = new Map();
const roomIDBuzzerTimeoutMap = new Map();
const roomIDBuzzerTimerIntervalMap = new Map();

const maxPlayers = 16;

export function logData() {
    console.log("quizBattleState", quizBattleState);
    console.log("userIDRoomIDMap", userIDRoomIDMap);
    console.log("hostIDRoomIDMap", hostIDRoomIDMap);
    console.log("roomIDBuzzerTimeoutMap", roomIDBuzzerTimeoutMap);
    console.log("roomIDBuzzerTimerIntervalMap", roomIDBuzzerTimerIntervalMap);
};

export function addToSkippingPlayers(userID, username, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    if (!isSkippingPlayer(userID, roomID)) {
        roomState.skippingPlayers[userID] = { userID, username }
    }
};

export function buzzedBefore(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    return roomState?.buzzeredPlayers?.some(playerObj => playerObj.userID === userID);
};

export function cancleActiveBuzzer(roomID) {
    if (roomIDBuzzerTimeoutMap.has(roomID)) {
        const timeoutID = roomIDBuzzerTimeoutMap.get(roomID);
        clearTimeout(timeoutID);
        roomIDBuzzerTimeoutMap.delete(roomID);
    }
    if (roomIDBuzzerTimerIntervalMap.has(roomID)) {
        const timerIntervalID = roomIDBuzzerTimerIntervalMap.get(roomID);
        clearInterval(timerIntervalID);
        roomIDBuzzerTimerIntervalMap.delete(roomID);
    }
    resetActiveBuzzer(roomID);
};

export function changeScoreOfPlayer(userID, roomID, scoreChange) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    roomState.score[userID].score += scoreChange;
};

export function cleanUpActives(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    resetActiveAnswer(roomID);
    resetActiveQuestion(roomID);
    resetActiveBuzzer(roomID);
    roomState.hasActiveQuestion = false;
    roomState.activeGuesses = {};
    roomState.skippingPlayers = {};
    roomState.buzzeredPlayers = [];
};

export function cleanUpRoom(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    Object.keys(roomState.players).forEach((userID) => {
        if (userIDRoomIDMap.has(userID)) userIDRoomIDMap.delete(userID);
    });
    if (hostIDRoomIDMap.has(roomState?.host?.userID)) hostIDRoomIDMap.delete(roomState.host.userID);
    if (roomIDBuzzerTimeoutMap.has(roomID)) roomIDBuzzerTimeoutMap.delete(roomID);
    if (roomIDBuzzerTimerIntervalMap.has(roomID)) roomIDBuzzerTimerIntervalMap.delete(roomID);
    delete quizBattleState[roomID];
};

export function checkActiveQuestionType(roomID, questionType) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return roomState.activeQuestion.questionType === questionType
};

export function checkForGameEnd(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    const isGameOver = roomState.questionsAnsweredCount >= (roomState.quizbattle.options.quiz.categoryCount * roomState.quizbattle.options.quiz.questionsPerCategory)
    if (!isGameOver) return
    roomState.finalScore = Object.keys(roomState.score).map(key => ({
        userID: key,
        username:  roomState.score[key].username,
        score: roomState.score[key].score,
        money: roomState.score[key].money,
    }));

    roomState.finalScore.sort((a, b) => b.score - a.score);
    handleEndStats(roomState.finalScore);
    try {
        increasePlayersHostedGames(roomState.host.userID);
    } catch (error) {
        console.log("There was an error in 'checkForGameEnd/increasePlayersHostedGames'", error.message);
    }
    setTimeout((roomID) => {
        if (Object.keys(quizBattleState).includes(roomID)) {
            cleanUpRoom(roomID);
        }
    }, (15 * 60 * 1000)); // DELETE ROOM AFTER 15 MINS AFTER GAME END IF STILL EXISTING
};

export async function createInitialRoomState(socket, quizbattleID) {
    const quizbattle = await getQuizBattleByID(quizbattleID);
    const roomState = {
        host: {
            socket: socket.id,
            userID: socket.user.userID,
            username: socket.user.username,
        },
        players: {},
        quizbattle: createDeepCopy(quizbattle),
        activePlayer: {index: 0, userID: null},
        questionsAnsweredCount: 0,
        hasActiveQuestion: false,
        activeQuestion: {},
        activeAnswer: {},
        activeBuzzer: {}, // userID, username
        activeGuesses: {}, // key: UserID, value string guess
        skippingPlayers: {},
        buzzeredPlayers: [],
        score: {},
        finalScore: [],
    }
    return roomState;
};

export async function createNewQuizBattleRoom(socket, quizbattleID) {
    const roomID = generateRandomString();
    const newRoomState = await createInitialRoomState(socket, quizbattleID);
    hostIDRoomIDMap.set(socket.user.userID, roomID);
    return {roomID, newRoomState};
};

export function deleteRoom(roomID) {
    const clientList = io.sockets.adapter.rooms.get(roomID);
    Array.from(clientList).forEach(function(socketID) {
        const socket = io.sockets.sockets.get(socketID)
        socket.leave(roomID);
        socket.emit("sendError", { error: "This room was deleted by the host." });
        socket.emit("redirectToHome");
    });
    cleanUpRoom(roomID);
};

export function doesRoomExist(roomID) {
    return io.sockets.adapter.rooms.has(roomID);
};

export function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 5;
    const existingList = Object.keys(quizBattleState);

    const randomString = Array.from({ length }, () => 
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    if (existingList.includes(randomString)) {
        return generateRandomString(existingList);
    }

    return randomString;
};

export function getCurrentRoomOfUserID(userID) {
    return userIDRoomIDMap?.get(userID) || hostIDRoomIDMap?.get(userID) || false;
};

export function getRoomState(roomID) {
    if (!(Object.keys(quizBattleState).includes(roomID))) return null
    return quizBattleState[roomID]
};

export function getUserSocket(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    if (!isUserInThisRoom(userID, roomID)) return false
    const userSocketID = roomState.players[userID].socket;
    return io?.sockets?.sockets?.get(userSocketID) || false;
};

export function hasRoomActiveBuzzer(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return !!Object.keys(roomState?.activeBuzzer).length
};

export function hasRoomActiveQuestion(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return !!roomState?.hasActiveQuestion
};

export function isActivePlayer(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return !!(roomState?.activePlayer?.userID === userID)
};

export function isActiveQuizBattleHost(userID) {
    return hostIDRoomIDMap?.has(userID);
};

export function isHostOfRoom(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return roomState?.host?.userID === userID
};

export function isRoomFull(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return Object.keys(roomState.players).length >= (maxPlayers - 1);
};

export function isSkippingPlayer(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return !!Object.keys(roomState?.skippingPlayers || {}).includes(userID)
};

export function isUserInARoom(userID) {
    return userIDRoomIDMap.has(userID);
};

export function isUserInThisRoom(userID, roomID) {
    if (!doesRoomExist(roomID)) return false
    const isUserInThisRoom = userIDRoomIDMap.has(userID)
    const roomState = getRoomState(roomID);
    if (!isUserInThisRoom) {
        if (Object.keys(roomState.players).includes(userID)) delete roomState.players[userID];
    }
    return isUserInThisRoom
};

export function joinToRoom(socket, userID, roomID, isHost) {
    const roomState = getRoomState(roomID);
    const startMoney = roomState.quizbattle.options.money.starting;
    socket.join(roomID);
    if (isHost) {
        roomState.host.socket = socket.id;
        hostIDRoomIDMap.set(userID, roomID);
    } else {
        userIDRoomIDMap.set(userID, roomID);
        if (Object.keys(roomState.players).includes(userID)) {
            roomState.players[userID].socket = socket.id; 
        } else {
            roomState.players[userID] = { socket: socket.id, userID: socket.user.userID, username: socket.user.username };
            roomState.score[userID] = {score: 0, money: startMoney, username: socket.user.username};
        }
    }
};

export function mapRoomStateToGameState(roomState) {
    const categories = mapCategoriesForGameState(roomState.quizbattle);
    return {
        host: {
            userID: roomState.host.userID,
            username: roomState.host.username
        },
        players: createDeepCopy(roomState.players),
        activePlayer: createDeepCopy(roomState.activePlayer),
        gameState: {
            name: roomState.quizbattle.name,
            categories: [...categories],
            options: createDeepCopy(roomState.quizbattle.options)
        },
        questionsAnsweredCount: roomState.questionsAnsweredCount,
        hasActiveQuestion: roomState.hasActiveQuestion,
        activeQuestion: createDeepCopy(roomState.activeQuestion),
        activeAnswer: createDeepCopy(roomState.activeAnswer),
        activeBuzzer: createDeepCopy(roomState.activeBuzzer),
        skippingPlayers: createDeepCopy(roomState.skippingPlayers),
        buzzeredPlayers: createDeepCopy(roomState.buzzeredPlayers),
        score: createDeepCopy(roomState.score),
        finalScore: createDeepCopy(roomState.finalScore),
    }
};

export function markBuzzerAsCorrect(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    const userID = roomState.activeBuzzer.userID;
    const scoreChange = roomState.activeQuestion.worth;
    changeScoreOfPlayer(userID, roomID, scoreChange);
    cancleActiveBuzzer(roomID);
    const categoryIndex = roomState?.activeQuestion?.categoryIndex;
    const questionIndex = roomState?.activeQuestion?.questionIndex;
    if (typeof categoryIndex !== "number" || typeof questionIndex !== "number") return false
    setActiveAnswer(categoryIndex, questionIndex, roomID);
    resetActiveQuestion(roomID);
};

export function markBuzzerAsWrong(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    const userID = roomState.activeBuzzer.userID;
    const scoreChange = parseInt((roomState.activeQuestion.worth) * (roomState.quizbattle.options.money.lossOnWrongAnswer || 0.5)) * -1;
    changeScoreOfPlayer(userID, roomID, scoreChange);
    cancleActiveBuzzer(roomID);
};

export function removePlayerFromRoom(socket, userID, roomID, sendError, errorMessage) {
    socket.leave(roomID);
    const roomState = getRoomState(roomID);
    if (userIDRoomIDMap.has(userID)) userIDRoomIDMap.delete(userID);
    if (Object.keys(roomState.players).includes(userID)) delete quizBattleState[roomID].players[userID];
    if (sendError) socket.emit("sendError", { error: errorMessage });
    socket.emit("redirectToHome");
};

export function sendUpdates(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    const hostSocketID = roomState?.host?.socket || undefined;
    if (!hostSocketID) return
    const hostSocket = io.sockets.sockets.get(hostSocketID);
    hostSocket.emit("hostStateUpdate", roomState);
    const gameState = mapRoomStateToGameState(roomState);
    io.to(roomID).emit("gameStateUpdate", gameState);
};

export function setActiveAnswer(categoryIndex, questionIndex, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.activeAnswer = {
        text: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.answer?.text || "",
        picture: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.answer?.picture || [],
        audio: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.answer?.audio || [],
        categoryIndex,
        questionIndex
    };
};

export function setActiveBuzzer(userID, username, correctedBuzzTime, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    const isMultiBuzzer = roomState?.quizbattle?.options?.quiz?.multiBuzzer || false;
    if (!isMultiBuzzer) {
        roomState.buzzeredPlayers.push({ userID, username, correctedBuzzTime });
    }
    roomState.activeBuzzer = { userID, username, correctedBuzzTime };
    const roomBuzzerTimerStart = (roomState?.quizbattle?.options?.quiz?.buzzerAnswerTimer || 30) * 1000; // Convert seconds to ms
    let roomBuzzerTimer = (roomBuzzerTimerStart / 1000);
    io.to(roomID).emit("updateBuzzerTime", roomBuzzerTimer);
    const intervalID = setInterval(() => {
        roomBuzzerTimer--;
        io.to(roomID).emit("updateBuzzerTime", roomBuzzerTimer);
    }, 1000);
    const timeoutID = setTimeout(() => {
        markBuzzerAsWrong(roomID);
        resetActiveBuzzer(roomID);
        sendUpdates(roomID);
        clearInterval(intervalID);
    }, roomBuzzerTimerStart + 1000); // One second more for server ping response(timeout and intervals arent 100% accurate aswell)
    roomIDBuzzerTimerIntervalMap.set(roomID, intervalID);
    roomIDBuzzerTimeoutMap.set(roomID, timeoutID);
};

export function setActivePlayer(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    if (!isUserInThisRoom(userID, roomID)) return false
    const userIndex = Object.keys(roomState.players).indexOf(userID);
    roomState.activePlayer = { index: userIndex, userID: userID };
    return true
};

export function setActiveQuestion(categoryIndex, questionIndex, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.activeQuestion = {
        question: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.question || "",
        picture: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.picture || [],
        audio: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.audio || [],
        worth: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.worth || 0,
        questionType: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.questionType || "buzzer",
        categoryIndex,
        questionIndex
    };
};

export function setNextActivePlayer(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    const playerIDs = Object.keys(roomState.players);
    const playerCount = playerIDs.length;
    const currentActivePlayerIndex = roomState.activePlayer.index;
    const nextActivePlayerIndex = (currentActivePlayerIndex + 1) % (playerCount);
    const nextActivePlayerUserID = Object.keys(roomState.players)[nextActivePlayerIndex];
    roomState.activePlayer = {index: nextActivePlayerIndex, userID: nextActivePlayerUserID};
};

export function setHasActiveQuestion(roomID, newValue) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.hasActiveQuestion = newValue;
};

export function setRoomState(roomID, roomState) {
    quizBattleState[roomID] = {...roomState};
};

export function setQuestionIsAnswered(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    const categoryIndex = roomState?.activeQuestion?.categoryIndex ?? roomState?.activeAnswer?.categoryIndex;
    const questionIndex = roomState?.activeQuestion?.questionIndex ?? roomState?.activeAnswer?.questionIndex;
    if (typeof categoryIndex !== 'number' || typeof questionIndex !== 'number') return false
    roomState.quizbattle.categories[categoryIndex].questions[questionIndex].isAnswered = true;
    roomState.questionsAnsweredCount++;
    cleanUpActives(roomID);
    checkForGameEnd(roomID);
};

export function tryToReconnect(socket) {
    const roomID = getCurrentRoomOfUserID(socket.user.userID);
    if (!roomID) {
        socket.emit("redirectToHome");
        return
    }
    const existingRoom = doesRoomExist(roomID);
    if (!existingRoom) {
        socket.emit("redirectToHome");
        return
    }
    const isHost = isHostOfRoom(socket.user.userID, roomID);
    joinToRoom(socket, socket.user.userID, roomID, isHost);
    socket.emit("redirectToRoom", roomID, () => { 
        sendUpdates(roomID);
    });
};

export function removeFromSkippingPlayers(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    if (isSkippingPlayer(userID, roomID)) delete roomState.skippingPlayers[userID];
};

export function resetActiveBuzzer(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.activeBuzzer = {};
};

export function resetActiveAnswer(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.activeAnswer = {};
};

export function resetActiveQuestion(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.activeQuestion = {};
};

export function verifyJWT(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken
    } catch (err) {
        return undefined;
    }
};

function createDeepCopy(object) {
    return JSON.parse(JSON.stringify(object));
};

async function getQuizBattleByID(quizbattleID) {
    const result = await QuizBattle.findById(quizbattleID).populate([
      { path: 'categories.questions.answeredFrom', model: 'User' },
      { path: 'owner', model: 'User' }
    ]);
    return result
};

function handleEndStats(finalScore) {
    try {
        increasePlayersWonGames(finalScore[0].userID);
        finalScore.forEach((playerObj) => {
            increasePlayersGamesPlayed(playerObj.userID);
            addPlayersTotalScore(playerObj.userID, playerObj.score);
        });
    } catch (error) {
        console.log("There was an error in 'handleEndStats'", error.message);
    }
};

function mapCategoriesForGameState(quizBattle) {
    return quizBattle.categories.map(category => ({
        categoryName: category?.title,
        questions: category?.questions.map(question => ({
            hasPicture: !!question?.picture?.length,
            hasAudio: !!question?.audio?.length,
            worth: question?.worth,
            isAnswered: question?.isAnswered,
            answeredFrom: question?.answeredFrom,
            isLockedForCount: question?.isLockedForCount
        }))
    }));
};
