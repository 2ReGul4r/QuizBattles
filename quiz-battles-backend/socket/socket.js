import { Server } from "socket.io";
import http from "http";
import express from "express";
import { handleQuizBattleEvents } from "../events/quizbattle.events.js";

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

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });

io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
});

export { app, io, server };