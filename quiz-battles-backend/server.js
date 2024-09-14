import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import authRoutes from "./routes/auth.routes.js";
import quizBattleRoutes from "./routes/quizbattle.routes.js";
import { app, server } from "./socket/socket.js";

const PORT = 5000;

dotenv.config();

app.use(cors({
    origin: ["http://localhost:5173", "https://mylevel.eu"],
    credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/quizbattle", quizBattleRoutes);

server.listen(PORT, () => {
    connectDB();
    console.log(`Server running ${PORT}`);
});
