import QuizBattle from "../models/quizbattle.model.js";
import jwt from "jsonwebtoken";

export function generateRandomString(existingList) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Großbuchstaben und Zahlen
    const length = 5;

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

export async function createInitialRoomState(hostSocket, hostUserID, hostUsername, quizbattleID) {
    const quizbattle = await getQuizBattleByID(quizbattleID);
    const roomState = {
        hostSocket: hostSocket,
        hostUserID: hostUserID,
        hostUsername: hostUsername,
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
        hostSocket: roomState.hostSocket,
        hostUserID: roomState.hostUserID,
        hostUsername: roomState.hostUsername,
        players: roomState.players,
        scores: roomState.scores,
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

export function verifyJWT(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken
    } catch (err) {
        return undefined;
    }
}

async function getQuizBattleByID(quizbattleID) {
    const result = await QuizBattle.findOne({ _id: quizbattleID })
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