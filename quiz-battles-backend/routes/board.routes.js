import express from "express";
import { createBoard, readBoard, updateBoard, deleteBoard } from "../controllers/board.controller.js";

const router = express.Router();

router.post("/create", createBoard);

router.post("/read", readBoard)

router.post("/update", updateBoard);

router.post("/delete", deleteBoard);

export default router;
