import jwt from "jsonwebtoken";
import QuizBattle from "../models/quizbattle.model.js";
import defaultQuizBattle from "../utils/defaultQuizBattle.js";

function getUserData(cookie) {
    if (!cookie) {
        return {};
    }
    const decodedToken = jwt.verify(cookie, process.env.JWT_SECRET);
    return decodedToken;
};

export const createQuizBattle = async (req, res) => {
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
        console.log("Error in createQuizBattle controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const saveQuizBattle = async (req, res) => {
    try {
        const state = req.body;
        const {userID, email, username, isAdmin} = getUserData(req.cookies.userjwt);
        if (!userID) {
            return res.status(403).json({error: "Not logged in."});
        }
        if (state.owner !== userID) {
            return res.status(400).json({error: "This is not your QuizBattle."});
        }
        if (state.categories) {
            state.categories.forEach(category => {
                if (category.questions) {
                    category.questions.forEach(question => {
                        if (question && !["buzzer", "guess"].includes(question?.questionType)) {
                            question.questionType = "buzzer";
                        }
                    });
                }
            });
        }
        const result = await QuizBattle.findOneAndUpdate({ _id: state._id, owner: userID }, state);
        if (result) {
            res.status(201).json(result)
        }
    } catch (error) {
        console.log("Error in saveQuizBattle controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const getQuizBattles = async (req, res) => {
    try {
        const { userID, email, username, isAdmin } = getUserData(req.cookies.userjwt);
        // Finde alle QuizBattle-Einträge, die diesem User gehören, und wähle nur die relevanten Felder aus
        const result = await QuizBattle.find({ owner: userID })
            .select("_id name createdAt updatedAt"); // Nur diese Felder zurückgeben

        if (result) {
            res.status(200).json(result); // 200 für eine erfolgreiche Anfrage
        } else {
            console.log("Error in getQuizBattles controller: No results found.");
            res.status(404).json({ error: "No QuizBattles found for this user." });
        }
    } catch (error) {
        console.log("Error in getQuizBattles controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const readQuizBattle = async (req, res) => {
    try {
        const { userID, email, username, isAdmin } = getUserData(req.cookies.userjwt);
        // Finde alle QuizBattle-Einträge, die diesem User gehören, und wähle nur die relevanten Felder aus
        const quizbattleID = req.query.quizbattleID;
        const result = await QuizBattle.findOne({ _id: quizbattleID, owner: userID })

        if (result) {
            res.status(200).json(result); // 200 für eine erfolgreiche Anfrage
        } else {
            console.log("Error in readQuizBattle controller: No results found.");
            res.status(404).json({ error: "No QuizBattles found for this user." });
        }
    } catch (error) {
        console.log("Error in readQuizBattle controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteQuizBattle = async (req, res) => {
    try {
        const { userID, email, username, isAdmin } = getUserData(req.cookies.userjwt);
        // Finde alle QuizBattle-Einträge, die diesem User gehören, und wähle nur die relevanten Felder aus
        const { quizbattleID } = req.body;
        const result = await QuizBattle.deleteOne({ _id: quizbattleID, owner: userID });

        if (result) {
            res.status(200).json(result); // 200 für eine erfolgreiche Anfrage
        } else {
            console.log("Error in deleteQuizBattle controller: No results found.");
            res.status(404).json({ error: "QuizBattles not found for this user." });
        }
    } catch (error) {
        console.log("Error in deleteQuizBattle controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
};
