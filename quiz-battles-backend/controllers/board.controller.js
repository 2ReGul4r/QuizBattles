import jwt from "jsonwebtoken";
import QuizBattle from "../models/quizbattle.model.js";

async function createOrUpdateQuiz(query, updateData) {
    const options = {
      new: true, // Gibt das aktualisierte Dokument zurück
      upsert: true, // Erstellt ein neues Dokument, wenn keines gefunden wird
    };
  
    const result = await QuizBattle.findOneAndUpdate(query, updateData, options);
    console.log(result);
    return result;
  }

export const saveBoard = async (req, res) => {
    try {
        console.log('request', req.body);
        const state = req.body;
        const token = req.cookies.userjwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (state.owner !== decodedToken.userID) {
            return res.status(400).json({error: "This is not your board."});
        }
        createOrUpdateQuiz({ name: state.name, owner: decodedToken.userID }, state)
            .then(result => res.status(201).json(result))
            .catch(error => {
                //throw new Error;
            })
        
    } catch (error) {
        console.log("Error in saveBoard controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const readBoard = async (req, res) => {
    
}

export const deleteBoard = async (req, res) => {
    
}