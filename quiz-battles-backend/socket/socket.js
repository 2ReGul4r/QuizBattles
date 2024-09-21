import { Server } from "socket.io";
import http from "http";
import express from "express";
//import { handleQuizBattleEvents } from "../events/quizbattle.events.js";
import { handleQuizBattleEvents } from "../events/wrapper.events.js";
import { cleanUpRoom } from "../utils/quizbattleUtils.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://mylevel.eu", "https://www.mylevel.eu"],
        credentials: true
    }
});

io.on("connection", async (socket) => {
    //await handleQuizBattleEvents(socket);
    handleQuizBattleEvents(socket);
})

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});

io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
    cleanUpRoom(room);
});

export { app, io, server };