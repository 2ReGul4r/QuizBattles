import mongoose from "mongoose";
const Schema = mongoose.Schema;

//TO-DO NEU MACHEN MIT AKTUELLEM QUIZBATTLESTATE

const Board = mongoose.model("Board", boardSchema);

export default Board;
