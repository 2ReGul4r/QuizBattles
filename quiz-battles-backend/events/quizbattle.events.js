import { generateRandomString, createInitialRoomState, verifyJWT, getUserColor } from "../utils/quizbattleUtils.js";

export const quizBattleState = {}

const maxPlayers = 12;

export const handleQuizBattleEvents = (socket) => {
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
        callback({[newRoomID]: newRoomState})
    })

    socket.on("joinQuizBattle", (props, callback) => {
        const decoded = verifyJWT(socket.handshake.auth.token);
        if (!decoded) {
            socket.emit("userNotAuthenticated", { error: "Please login to join a game."});
            return
        };
        if (!(props.roomID in quizBattleState)) {
            socket.emit("roomDoesNotExist", { error: "This room does not exist."});
            return
        }
        if (Object.keys(quizBattleState[props.roomID].players).length >= maxPlayers) {
            socket.emit("roomIsFull", { error: "This room is full."});
            return
        }
        const userColor = getUserColor(Object.keys(quizBattleState[props.roomID].players).length);
        if (!userColor) {
            socket.emit("colorError", { error: "There was an error generating the color for the player."});
            return
        }
        if (userID in quizBattleState[props.roomID].players) quizBattleState[props.roomID].players[userID].socket = socket.id;
        else quizBattleState[props.roomID].players[userID] = {socket, color: userColor};
        socket.join(props.roomID)
        const roomStateUpdate = ""
        io.to(props.roomID).emit('playerJoinedRoom', {
            
        });
    })
}