import express from "express";
import { getAllItem, getItem, createItem, updateItem, deleteItem } from "../controllers/items.controller.js";

const router = express.Router();

router.post("/create", createItem);

router.post("/read", getItem);

router.post("/all", getAllItem);

router.post("/update", updateItem);

router.post("/delete", deleteItem);

export default router;
