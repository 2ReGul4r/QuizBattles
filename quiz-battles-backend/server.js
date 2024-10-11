import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import authRoutes from "./routes/auth.routes.js";
import quizBattleRoutes from "./routes/quizbattle.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import { app, server } from "./socket/socket.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs-extra";

const PORT = process.env.PORT || 5000;

dotenv.config();

// __dirname definieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
    origin: ["http://localhost:5173", "https://mylevel.eu", "https://www.mylevel.eu", "https://regul4r.com", "https://www.regul4r.com"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/quizbattle", quizBattleRoutes);
app.use("/api/media", mediaRoutes);

// Set the upload destination folder
export const uploadFolder = path.join(__dirname, 'uploads');
export const imagesFolder = path.join(uploadFolder, 'images');
export const audiosFolder = path.join(uploadFolder, 'audios');

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder, { recursive: true });
}

if (!fs.existsSync(audiosFolder)) {
    fs.mkdirSync(audiosFolder, { recursive: true });
}
app.use('/uploads', express.static(uploadFolder));

server.listen(PORT, () => {
    connectDB();
    console.log(`Server running ${PORT}`);
});
