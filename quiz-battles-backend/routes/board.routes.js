import express from "express";
import { saveBoard, readBoard, deleteBoard } from "../controllers/board.controller.js";

const router = express.Router();

router.post("/save", saveBoard);

router.post("/read", readBoard)

router.post("/delete", deleteBoard);

export default router;
