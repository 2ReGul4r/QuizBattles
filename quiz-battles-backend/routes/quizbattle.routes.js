import express from "express";
import { createQuizBattle, saveQuizBattle, readQuizBattle, getQuizBattles, deleteQuizBattle } from "../controllers/quizbattle.controller.js";

const router = express.Router();

router.post("/create", createQuizBattle);

router.post("/save", saveQuizBattle);

router.get("/read", readQuizBattle);

router.get("/get", getQuizBattles);

router.post("/delete", deleteQuizBattle);

export default router;
