import express from "express";
import { createBoard, saveBoard, readBoard, getBoards, deleteBoard } from "../controllers/board.controller.js";

const router = express.Router();

router.post("/create", createBoard);

router.post("/save", saveBoard);

router.get("/read", readBoard);

router.get("/get", getBoards);

router.post("/delete", deleteBoard);

export default router;
