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

export async function createInitialRoomState(hostSocket, hostUserID, quizbattleID) {
    const quizbattle = await getQuizBattleByID(quizbattleID);
    const roomState = {
        hostSocket: hostSocket,
        hostUserID: hostUserID,
        players: {}, 
        quizbattle: quizbattle,
    }
    return roomState;
}

export function mapRoomStateToGameState(roomState) {
    const categories = mapCategoriesForGameState(roomState.quizbattle);
    return {
        host: roomState.host,
        players: roomState.players,
        scores: roomState.scores,
        gameState: {
            name: roomState.quizbattle.name,
            categories: categories,
        }
    }
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
        }))
    }));
}