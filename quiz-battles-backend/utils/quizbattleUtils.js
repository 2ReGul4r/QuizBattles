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

/*
0: #FF6F61
1: #4CAF50
2: #FFC107
3: #FF5722
4: #009688
5: #75321A
6: #E91E63
7: #3F51B5
8: #F44336
9: #00BCD4
10: #8BC34A
11: #9E9E9E
*/

export function getUserColor(number) {
    const colorMap = {
        0: '#FF5733', // Orange
        1: '#33FF57', // Grün
        2: '#3357FF', // Blau
        3: '#F333FF', // Lila
        4: '#FFFF33', // Gelb
        5: '#00BFAE', // Kräftiges Türkis
        6: '#FF9800', // Warmes Orange
        7: '#673AB7', // Kräftiges Violett
        8: '#FF5722', // Kräftiges Orangerot
        9: '#8BC34A', // Frisches Grün
        10: '#C2185B', // Kräftiges Pink
        11: '#9C27B0'  // Tiefes Lila
    };

    // Rückgabe der Farbe, wenn die Zahl vorhanden ist, ansonsten Standardfarbe
    return colorMap[number] || undefined // Grau als Standardfarbe
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