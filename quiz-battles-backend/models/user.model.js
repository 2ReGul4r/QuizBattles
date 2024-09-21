import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    wonGames: {
        type: Number,
        default: 0
    },
    gamesPlayed: {
        type: Number,
        default: 0
    },
    battlesWon: {
        type: Number,
        default: 0
    },
    battlesPlayed: {
        type: Number,
        default: 0
    },
    totalScore: {
        type: Number,
        default: 0
    },
    hostedGames: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model("User", userSchema);

export default User;
