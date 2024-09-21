import User from "../models/user.model.js";

export async function increasePlayersWonGames(userID) {
    await User.findByIdAndUpdate(userID, { $inc: { wonGames: 1 } })
};

export async function increasePlayersGamesPlayed(userID) {
    await User.findByIdAndUpdate(userID, { $inc: { gamesPlayed: 1 } })
};

export async function increasePlayersBattlesWon(userID) {
    await User.findByIdAndUpdate(userID, { $inc: { battlesWon: 1 } })
};

export async function increasePlayersBattlesPlayed(userID) {
    await User.findByIdAndUpdate(userID, { $inc: { battlesPlayed: 1 } })
};

export async function addPlayersTotalScore(userID, scoreChange) {
    await User.findByIdAndUpdate(userID, { $inc: { totalScore: scoreChange } })
};

export async function increasePlayersHostedGames(userID) {
    await User.findByIdAndUpdate(userID, { $inc: { hostedGames: 1 } })
};
