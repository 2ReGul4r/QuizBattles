import { generateRandomString, createInitialRoomState, verifyJWT } from "../utils/quizbattleUtils.js";
import { io } from "../socket/socket.js";

export const quizBattleState = {}

const userIDRoomIDMap = new Map()
const hostIDRoomIDMap = new Map()

const maxPlayers = 12;

export const handleQuizBattleEvents = (socket) => {
    //on connect
    const decoded = verifyJWT(socket.handshake.auth.token);
    if (decoded && userIDRoomIDMap.has(decoded.userID)) {
        const roomID = userIDRoomIDMap.get(decoded.userID);
        if (io.sockets.adapter.rooms.has(roomID)){
            socket.join(roomID);
            quizBattleState[roomID].players[decoded.userID].socket = socket.id;
            socket.emit("redirectToRoom", roomID);
            const playersOfRoom = quizBattleState[roomID].players;
            io.to(roomID).emit("playersRoomUpdate", playersOfRoom);
        }
        
    }
    if (decoded && hostIDRoomIDMap.has(decoded.userID)) {
        const roomID = hostIDRoomIDMap.get(decoded.userID)
        if (io.sockets.adapter.rooms.has(roomID)) {
            socket.join(roomID);
            quizBattleState[roomID].hostSocket = socket.id;
            socket.emit("redirectToRoom", roomID);
            const playersOfRoom = quizBattleState[roomID].players;
            io.to(roomID).emit("playersRoomUpdate", playersOfRoom);
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
        const newRoomState = await createInitialRoomState(socket.id, decoded.userID, quizbattleID);
        quizBattleState[newRoomID] = newRoomState;
        socket.join(newRoomID);
        hostIDRoomIDMap.set(decoded.userID, newRoomID);
        callback({lobbyID: newRoomID, roomState: newRoomState})
    })

    socket.on("joinQuizBattle", async (roomID, callback) => {
        const decoded = verifyJWT(socket.handshake.auth.token);
        if (!decoded) {
            socket.emit("userNotAuthenticated", { error: "Please login to join a game."});
            return
        }
        if (!(Object.keys(quizBattleState).includes(roomID))) {
            socket.emit("roomDoesNotExist", { error: "This room does not exist."});
            return
        }
        if (Object.keys(quizBattleState[roomID].players).length >= (maxPlayers - 1 /*length uses index*/)) {
            socket.emit("roomIsFull", { error: "This room is full."});
            return
        }
        const userID = decoded.userID;
        if (userID in quizBattleState[roomID].players) quizBattleState[roomID].players[userID].socket = socket.id;
        else quizBattleState[roomID].players[userID] = {socket: socket.id, username: decoded.username };
        await socket.join(roomID);
        userIDRoomIDMap.set(userID, roomID);
        const playersOfRoom = quizBattleState[roomID].players;
        callback(true, roomID);
        io.to(roomID).emit("playersRoomUpdate", playersOfRoom);
    })

    socket.on("checkForRoomExistence", (roomID, callback) => {
        console.log("1", roomID);
        const doesExist = io.sockets.adapter.rooms.get(roomID)
        callback(doesExist);
        console.log("2", doesExist)
    })
}