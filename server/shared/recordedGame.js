const game = require("../models/game");

// Save a game record to the database
async function saveRecordMove(board, move, outcome = null) {
  try {
    const newGame = new game({ board, move, outcome });
    await newGame.save();
    console.log("Game record saved:", newGame);
  } catch (err) {
    console.error("Error saving game record:", err.message);
  }
}

// Load all recorded games from the database
async function loadRecordedGames() {
  try {
    const games = await game.find(); // Fetch all games
    console.log("Loaded recorded games:", games);
    return games;
  } catch (err) {
    console.error("Error loading recorded games:", err.message);
    return [];
  }
}

module.exports = {
  saveRecordMove,
  loadRecordedGames,
};
