import QuizBattle from "../models/quizbattle.model.js";
import jwt from "jsonwebtoken";
import { io } from "../socket/socket.js";
import { quizBattleState, userIDRoomIDMap, hostIDRoomIDMap, maxPlayers } from "../events/wrapper.events.js";

export function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Großbuchstaben und Zahlen
    const length = 5;
    const existingList = Object.keys(quizBattleState);

    // Funktion zur Generierung eines zufälligen Strings
    const randomString = Array.from({ length }, () => 
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    // Wenn der String bereits in der Liste ist, rekursiv aufrufen
    if (existingList.includes(randomString)) {
        return generateRandomString(existingList);
    }

    return randomString;
}

export async function createInitialRoomState(socket, quizbattleID) {
    const quizbattle = await getQuizBattleByID(quizbattleID);
    const roomState = {
        host: {
            socket: socket.id,
            ...socket.user
        },
        players: {},
        quizbattle: quizbattle,
        activePlayer: {index: 0, userID: undefined}
    }
    return roomState;
}

export function mapRoomStateToGameState(roomState) {
    const categories = mapCategoriesForGameState(roomState.quizbattle);
    const activePlayerUserID = roomState.activePlayer.userID || Object.keys(roomState.players)[roomState.activePlayer.index] || undefined;
    return {
        host: { ...roomState.host },
        players: roomState.players,
        activePlayer: {index: roomState.activePlayer.index, userID: activePlayerUserID},
        gameState: {
            name: roomState.quizbattle.name,
            categories: categories,
        }
    }
}

export function setNextActivePlayer(roomState) {
    const playerIDs = Objects.keys(roomState.players);
    const playerCount = playerIDs.length;
    const currentActivePlayerIndex = roomState.activePlayer.index;
    const nextActivePlayerIndex = (currentActivePlayerIndex + 1) % (playerCount - 1);
    roomState.activePlayer = {index: nextActivePlayerIndex, userID: Object.keys(roomState.players)[nextActivePlayerIndex]}
}

export async function createNewQuizBattleRoom(socket, quizbattleID) {
    const roomID = generateRandomString();
    const newRoomState = await createInitialRoomState(socket, quizbattleID);
    quizBattleState[roomID] = newRoomState;
    hostIDRoomIDMap.set(socket.user.userID, roomID);
    return {roomID, newRoomState};
}

export function verifyJWT(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken
    } catch (err) {
        return undefined;
    }
}

export function doesRoomExist(roomID) {
    return io.sockets.adapter.rooms.has(roomID);
}

export function isRoomFull(roomID) {
    return Object.keys(quizBattleState[roomID].players).length >= (maxPlayers - 1);
}

export function joinToRoom(socket, userID, roomID, isHost) {
    const roomState = getRoomState(roomID);
    socket.join(roomID);
    if (isHost) {
        roomState.host.socket = socket.id;
        hostIDRoomIDMap.set(userID, roomID);
    } else {
        userIDRoomIDMap.set(userID, roomID);
        if (Object.keys(roomState.players).includes(userID)) {
            roomState.players[userID].socket = socket.id; 
        } else {
            roomState.players[userID] = { socket: socket.id, ...socket.user };
        }
    }
}

export function getRoomState(roomID) {
    if (!(Object.keys(quizBattleState).includes(roomID))) return null
    return quizBattleState[roomID]
}

export function setRoomState(roomID, roomState) {
    quizBattleState[roomID] = roomState;
}

export function isActiveQuizBattleHost(userID) {
    return hostIDRoomIDMap.has(userID);
}

export function isUserInThisRoom(userID, roomID) {
    if (!doesRoomExist(roomID)) return false
    const isUserInThisRoom = userIDRoomIDMap.has(userID)
    const roomState = getRoomState(roomID);
    if (!isUserInThisRoom) {
        if (Object.keys(roomState.players).includes(userID)) delete roomState.players[userID];
    }
    return isUserInThisRoom
}

export function isUserInARoom(socket, userID) {
    const isInRoomMap = userIDRoomIDMap.has(userID);
    const hasOtherRoomsThanSocket = socket.rooms.length > (socket.rooms.has(socket.id) ? 1 : 0);
    return isInRoomMap || hasOtherRoomsThanSocket
}

export function isHostOfRoom(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return roomState.host.userID === userID
}

export function getUserSocket(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    if (!isUserInThisRoom(userID, roomID)) return false
    const userSocketID = roomState.players[userID].socket;
    return io.sockets.sockets.get(userSocketID) || false;
}

export function removePlayerFromRoom(socket, userID, roomID, sendError, errorMessage) {
    socket.leave(roomID);
    const roomState = getRoomState(roomID);
    if (userIDRoomIDMap.has(userID)) userIDRoomIDMap.delete(userID);
    if (Object.keys(roomState.players).includes(userID)) delete quizBattleState[roomID].players[userID];
    if (sendError) socket.emit("sendError", { error: errorMessage });
    socket.emit("redirectToHome");
}

export function getCurrentRoomOfUserID(userID) {
    return userIDRoomIDMap.get(userID) || hostIDRoomIDMap.get(userID) || false;
}

async function getQuizBattleByID(quizbattleID) {
    const result = await QuizBattle.findOne({ _id: quizbattleID });
    return result
}

function mapCategoriesForGameState(quizBattle) {
    return quizBattle.categories.map(category => ({
        categoryName: category.title,
        questions: category.questions.map(question => ({
            hasPicture: question.picture && question.picture.length > 0,
            hasAudio: question.audio && question.audio.length > 0,
            worth: question.worth,
            isAnswered: question.isAnswered,
        }))
    }));
}