import QuizBattle from "../models/quizbattle.model.js";
import jwt from "jsonwebtoken";
import { io } from "../socket/socket.js";

export const quizBattleState = {};

const userIDRoomIDMap = new Map();
const hostIDRoomIDMap = new Map();

const maxPlayers = 12;

export function cleanUpRoom(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    Object.keys(roomState.players).forEach((userID) => {
        if (userIDRoomIDMap.has(userID)) userIDRoomIDMap.delete(userID);
        if (hostIDRoomIDMap.has(userID)) hostIDRoomIDMap.delete(userID);
    });
    delete quizBattleState[roomID];
}

export function checkHasActiveQuestion(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return
    roomState.hasActiveQuestion = (!!Object.keys(roomState.activeQuestion).length || !!Object.keys(roomState.activeAnswer).length) || false;
}

export async function createInitialRoomState(socket, quizbattleID) {
    const quizbattle = await getQuizBattleByID(quizbattleID);
    const roomState = {
        host: {
            socket: socket.id,
            ...socket.user
        },
        players: {},
        quizbattle: createDeepCopy(quizbattle),
        activePlayer: {index: 0, userID: undefined},
        hasActiveQuestion: false,
        activeQuestion: {},
        activeAnswer: {},
        activeBuzzer: "", //UserID
        activeGuesses: {}, // key: UserID, value string guess
        skippingPlayers: [],
        buzzeredPlayers: [],
        score: {},
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
}

export function doesRoomExist(roomID) {
    return io.sockets.adapter.rooms.has(roomID);
};

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
};

export function getCurrentRoomOfUserID(userID) {
    return userIDRoomIDMap.get(userID) || hostIDRoomIDMap.get(userID) || false;
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
    return io.sockets.sockets.get(userSocketID) || false;
};

export function hasRoomActiveQuestion(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return !!roomState.hasActiveQuestion
}

export function isActivePlayer(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return !!(roomState.activePlayer?.userID === userID)
}

export function isActiveQuizBattleHost(userID) {
    return hostIDRoomIDMap.has(userID);
};

export function isHostOfRoom(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    return roomState.host.userID === userID
};

export function isRoomFull(roomID) {
    return Object.keys(quizBattleState[roomID].players).length >= (maxPlayers - 1);
};

export function isUserInARoom(socket, userID) {
    const isInRoomMap = userIDRoomIDMap.has(userID);
    //TODO. Check why socket.rooms.length is undefined
    //const hasOtherRoomsThanSocket = socket.rooms.length > (socket.rooms.has(socket.id) ? 1 : 0);
    return isInRoomMap //|| hasOtherRoomsThanSocket
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
            roomState.players[userID] = { socket: socket.id, ...socket.user };
            roomState.score[userID] = {score: 0, money: startMoney};
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
        hasActiveQuestion: roomState.hasActiveQuestion,
        activeQuestion: createDeepCopy(roomState.activeQuestion),
        activeAnswer: createDeepCopy(roomState.activeAnswer),
        activeBuzzer: roomState.activeBuzzer,
        activeGuesses: createDeepCopy(roomState.activeGuesses),
        skippingPlayers: createDeepCopy(roomState.skippingPlayers),
        buzzeredPlayers: createDeepCopy(roomState.buzzeredPlayers),
        score: createDeepCopy(roomState.score),
    }
};

export function removePlayerFromRoom(socket, userID, roomID, sendError, errorMessage) {
    socket.leave(roomID);
    const roomState = getRoomState(roomID);
    if (userIDRoomIDMap.has(userID)) userIDRoomIDMap.delete(userID);
    if (Object.keys(roomState.players).includes(userID)) delete quizBattleState[roomID].players[userID];
    if (sendError) socket.emit("sendError", { error: errorMessage });
    socket.emit("redirectToHome");
};

export function setActiveAnswer(categoryIndex, questionIndex, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.activeAnswer = {
        text: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.answer?.text || "",
        picture: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.answer?.picture || [],
        audio: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.answer?.audio || [],
    };
}

export function setActivePlayer(userID, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    if (!isUserInThisRoom(userID, roomID)) return false
    const userIndex = Object.keys(roomState.players).indexOf(userID);
    roomState.activePlayer = { index: userIndex, userID: userID };
    return true
}

export function setActiveQuestion(categoryIndex, questionIndex, roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.activeQuestion = {
        question: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.question || "",
        picture: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.picture || [],
        audio: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.audio || [],
        worth: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.worth || 0,
        questionType: roomState?.quizbattle?.categories[categoryIndex]?.questions[questionIndex]?.questionType || "buzzer",
    };
}

export function setNextActivePlayer(roomState) {
    const playerIDs = Objects.keys(roomState.players);
    const playerCount = playerIDs.length;
    const currentActivePlayerIndex = roomState.activePlayer.index;
    const nextActivePlayerIndex = (currentActivePlayerIndex + 1) % (playerCount - 1);
    const nextActivePlayerUserID = Object.keys(roomState.players)[nextActivePlayerIndex];
    roomState.activePlayer = {index: nextActivePlayerIndex, userID: nextActivePlayerUserID};
};

export function setRoomState(roomID, roomState) {
    quizBattleState[roomID] = {...roomState};
};

export function setQuestionIsAnswered(categoryIndex, questionIndex, roomID, isAnswered) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.quizbattle.categories[categoryIndex].questions[questionIndex].isAnswered = isAnswered;
}

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
        const roomState = getRoomState(roomID);
        const gameState = mapRoomStateToGameState(roomState)
        io.to(roomID).emit("gameStateUpdate", gameState);
    });
};

export function resetActiveAnswer(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.activeAnswer = {};
}

export function resetActiveQuestion(roomID) {
    const roomState = getRoomState(roomID);
    if (!roomState) return false
    roomState.activeQuestion = {};
}

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
}

async function getQuizBattleByID(quizbattleID) {
    const result = await QuizBattle.findById(quizbattleID).populate([
      { path: 'categories.questions.answeredFrom', model: 'User' },
      { path: 'owner', model: 'User' }
    ]);
    return result
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
