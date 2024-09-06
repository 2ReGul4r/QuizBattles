import { Server } from "socket.io";
import http from "http";
import express from "express";
import { handleQuizBattleEvents } from "../events/quizbattle.events.js";
import { verifyJWT } from "../utils/quizbattleUtils.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    handleQuizBattleEvents(socket);
})

export { app, io, server };