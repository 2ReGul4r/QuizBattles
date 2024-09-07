import { generateRandomString, createInitialRoomState, verifyJWT, mapRoomStateToGameState } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export const quizBattleState = {}

const userIDRoomIDMap = new Map()
const hostIDRoomIDMap = new Map()

const maxPlayers = 12;

export const handleQuizBattleEvents = async (socket) => {
    //on connect
    const decoded = verifyJWT(socket.handshake.auth.token);
    if (decoded && userIDRoomIDMap.has(decoded.userID)) {
        const roomID = userIDRoomIDMap.get(decoded.userID);
        if (io.sockets.adapter.rooms.has(roomID)) {
            socket.join(roomID);
            quizBattleState[roomID].players[decoded.userID].socket = socket.id;
            socket.emit("redirectToRoom", roomID, async () => {
                const playersOfRoom = quizBattleState[roomID].players;
                const gameState = await mapRoomStateToGameState(quizBattleState[roomID])
                io.to(roomID).emit("gameStateUpdate", gameState);
                io.to(roomID).emit("playersRoomUpdate", playersOfRoom);
            });
        }
        
    }
    if (decoded && hostIDRoomIDMap.has(decoded.userID)) {
        const roomID = hostIDRoomIDMap.get(decoded.userID)
        if (io.sockets.adapter.rooms.has(roomID)) {
            socket.join(roomID);
            quizBattleState[roomID].hostSocket = socket.id;
            socket.emit("redirectToRoom", roomID, async () => {
                const playersOfRoom = quizBattleState[roomID].players;
                const gameState = await mapRoomStateToGameState(quizBattleState[roomID])
                io.to(roomID).emit("gameStateUpdate", gameState);
                io.to(roomID).emit("playersRoomUpdate", playersOfRoom);
                socket.emit("setHostState", quizBattleState[roomID])
            });
        }
    }

    socket.on("hostQuizBattle", async (props, callback) => {
        const { quizbattleID } = props;
        const decoded = verifyJWT(socket.handshake.auth.token);
        if (!decoded) {
            socket.emit("userNotAuthenticated", { error: "Please login to host a game."});
            return
        }
        const newRoomID = generateRandomString(Object.keys(quizBattleState));
        const newRoomState = await createInitialRoomState(socket.id, decoded.userID, decoded.username, quizbattleID);
        quizBattleState[newRoomID] = newRoomState;
        socket.join(newRoomID);
        hostIDRoomIDMap.set(decoded.userID, newRoomID);
        callback({lobbyID: newRoomID, roomState: newRoomState})
        const gameState = await mapRoomStateToGameState(quizBattleState[newRoomID])
        io.to(newRoomID).emit("gameStateUpdate", gameState);
        socket.emit("setHostState", quizBattleState[newRoomID])
    })

    socket.on("joinQuizBattle", async (roomID, callback) => {
        const decoded = verifyJWT(socket.handshake.auth.token);
        if (!decoded) {
            socket.emit("sendError", { error: "Please login to join a game."});
            return
        }
        if (!(Object.keys(quizBattleState).includes(roomID))) {
            socket.emit("sendError", { error: "This room does not exist."});
            return
        }
        if (Object.keys(quizBattleState[roomID].players).length >= (maxPlayers - 1 /*length uses index*/)) {
            socket.emit("sendError", { error: "This room is full."});
            return
        }
        const userID = decoded.userID;
        if (userID in quizBattleState[roomID].players) quizBattleState[roomID].players[userID].socket = socket.id;
        else quizBattleState[roomID].players[userID] = {socket: socket.id, username: decoded.username };
        socket.join(roomID);
        userIDRoomIDMap.set(userID, roomID);
        await callback(true, roomID)
        const playersOfRoom = quizBattleState[roomID].players;
        const gameState = await mapRoomStateToGameState(quizBattleState[roomID])
        io.to(roomID).emit("gameStateUpdate", gameState);
        io.to(roomID).emit("playersRoomUpdate", playersOfRoom);
    })

    socket.on("getPlayersInMyRoom", (callback) => {
        const decoded = verifyJWT(socket.handshake.auth.token);
        if (!decoded) {
            socket.emit("sendError", { error: "Please login to join a game."});
            return
        }
        if (!userIDRoomIDMap.has(decoded.userID)) {
            socket.emit("sendError", { error: "You are not in a game."});
            return
        }
        const roomID = userIDRoomIDMap.get(decoded.userID);
        if(!io.sockets.adapter.rooms.has(roomID)) {
            socket.emit("sendError", { error: "This room does not exist."});
            userIDRoomIDMap.delete(decoded.userID);
            return
        }
        const playersOfRoom = quizBattleState[roomID].players;
        callback(playersOfRoom);
    })

    socket.on("getGameUpdate", async (callback) => {
        const decoded = verifyJWT(socket.handshake.auth.token);
        if (!decoded) {
            socket.emit("sendError", { error: "Please login to join a game."});
            return
        }
        if (!userIDRoomIDMap.has(decoded.userID)) {
            socket.emit("sendError", { error: "You are not in a game."});
            return
        }
        const roomID = userIDRoomIDMap.get(decoded.userID);
        const playersOfRoom = quizBattleState[roomID].players;
        const gameState = await mapRoomStateToGameState(quizBattleState[roomID])
        callback(gameState, playersOfRoom);
    })

    socket.on("checkForRoomExistence", (roomID, callback) => {
        const doesExist = io.sockets.adapter.rooms.get(roomID)
        callback(doesExist);
    })

    socket.on("kickPlayer", async (userID, callback) => {
        const decoded = verifyJWT(socket.handshake.auth.token);
        if (!decoded) {
            socket.emit("sendError", { error: "You are not logged in."});
            return
        }
        if (!hostIDRoomIDMap.has(decoded.userID)) {
            socket.emit("sendError", { error: "You do not host a game."});
            return
        }
        const hostRoomID = hostIDRoomIDMap.get(decoded.userID);
        if (quizBattleState[hostRoomID].hostUserID !== decoded.userID) {
            socket.emit("sendError", { error: "This is not your game."});
            return
        }
        if (!userIDRoomIDMap.has(userID)) {
            socket.emit("sendError", { error: "This user is not in a game."});
            return
        }
        const userRoomID = userIDRoomIDMap.get(userID);
        if (userRoomID !== hostRoomID) {
            socket.emit("sendError", { error: "This user is not in your game."});
            return
        }
        const userSocketID = quizBattleState[userRoomID].players[userID].socket;
        const userToKickSocket = io.sockets.sockets.get(userSocketID);

        userToKickSocket.leave(hostRoomID);
        userIDRoomIDMap.delete(userID);
        userToKickSocket.emit("sendError", { error: "Your were kicked from this game"});
        delete quizBattleState[hostRoomID].players[userID];

        const playersOfRoom = quizBattleState[hostRoomID].players;
        const gameState = await mapRoomStateToGameState(quizBattleState[hostRoomID])
        userToKickSocket.emit("redirectToHome");
        io.to(hostRoomID).emit("gameStateUpdate", gameState);
        io.to(hostRoomID).emit("playersRoomUpdate", playersOfRoom);
        callback(true);
    })

    socket.on("leaveGame", async () => {
        const decoded = verifyJWT(socket.handshake.auth.token);
        if (!decoded) {
            socket.emit("sendError", { error: "You are not logged in."});
            return
        }
        const userID = decoded.userID;
        if (!userIDRoomIDMap.has(userID)) {
            socket.emit("sendError", { error: "You are not in a game."});
            return
        }
        const userRoomID = userIDRoomIDMap.get(userID);
        socket.leave(userRoomID);

        delete quizBattleState[userRoomID].players[userID];
        userIDRoomIDMap.delete(userID);

        const playersOfRoom = quizBattleState[userRoomID].players;
        const gameState = await mapRoomStateToGameState(quizBattleState[userRoomID])
        socket.emit("redirectToHome");
        io.to(userRoomID).emit("gameStateUpdate", gameState);
        io.to(userRoomID).emit("playersRoomUpdate", playersOfRoom);
    })
}