import jwt from "jsonwebtoken";
import QuizBattle from "../models/quizbattle.model.js";
import defaultQuizBattle from "../utils/defaultQuizBattle.js";

async function createOrUpdateQuiz(query, updateData) {
    const result = await QuizBattle.findOneAndUpdate(query, updateData);
    return result;
}

function getUserData(cookie) {
    if (!cookie) {
        return {};
    }
    const decodedToken = jwt.verify(cookie, process.env.JWT_SECRET);
    return decodedToken;
}

export const createBoard = async (req, res) => {
    try {
        const {userID, email, username, isAdmin} = getUserData(req.cookies.userjwt);
        if (!userID) {
            return res.status(403).json({error: "Not logged in."});
        }
        const newQuizSetting = {...defaultQuizBattle, owner: userID}
        const newQuizBattle = new QuizBattle(newQuizSetting)
        if (!newQuizBattle) {
            res.status(400).json({error: "Could not create."})
        }
        await newQuizBattle.save()
        res.status(201).json(newQuizBattle)
    } catch (error) {
        console.log("Error in createBoard controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
} 

export const saveBoard = async (req, res) => {
    try {
        const state = req.body;
        const {userID, email, username, isAdmin} = getUserData(req.cookies.userjwt);
        if (!userID) {
            return res.status(403).json({error: "Not logged in."});
        }
        if (state.owner !== userID) {
            return res.status(400).json({error: "This is not your board."});
        }
        const result = await QuizBattle.findOneAndUpdate({ _id: state._id, owner: userID }, state);
        if (result) {
            res.status(201).json(result)
        }
    } catch (error) {
        console.log("Error in saveBoard controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getBoards = async (req, res) => {
    try {
        const { userID, email, username, isAdmin } = getUserData(req.cookies.userjwt);
        // Finde alle QuizBattle-Einträge, die diesem User gehören, und wähle nur die relevanten Felder aus
        const result = await QuizBattle.find({ owner: userID })
            .select("_id name createdAt updatedAt"); // Nur diese Felder zurückgeben

        if (result) {
            res.status(200).json(result); // 200 für eine erfolgreiche Anfrage
        } else {
            console.log("Error in getBoards controller: No results found.");
            res.status(404).json({ error: "No boards found for this user." });
        }
    } catch (error) {
        console.log("Error in getBoards controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const readBoard = async (req, res) => {
    try {
        const { userID, email, username, isAdmin } = getUserData(req.cookies.userjwt);
        // Finde alle QuizBattle-Einträge, die diesem User gehören, und wähle nur die relevanten Felder aus
        const boardID = req.query.boardID;
        const result = await QuizBattle.findOne({ _id: boardID, owner: userID })

        if (result) {
            res.status(200).json(result); // 200 für eine erfolgreiche Anfrage
        } else {
            console.log("Error in readBoard controller: No results found.");
            res.status(404).json({ error: "No QuizBattles found for this user." });
        }
    } catch (error) {
        console.log("Error in readBoard controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteBoard = async (req, res) => {
    try {
        const { userID, email, username, isAdmin } = getUserData(req.cookies.userjwt);
        // Finde alle QuizBattle-Einträge, die diesem User gehören, und wähle nur die relevanten Felder aus
        const { boardID } = req.body;
        const result = await QuizBattle.deleteOne({ _id: boardID, owner: userID });

        if (result) {
            res.status(200).json(result); // 200 für eine erfolgreiche Anfrage
        } else {
            console.log("Error in deleteBoard controller: No results found.");
            res.status(404).json({ error: "QuizBattles not found for this user." });
        }
    } catch (error) {
        console.log("Error in deleteBoard controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}