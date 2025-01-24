const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  board: {
    type: [String], // Array of strings representing the board (e.g., ["X", null, "O"])
    required: true,
  },
  move: {
    type: Number, // Index of the move
    required: true,
  },
  outcome: {
    type: String, // Outcome of the game (e.g., "X wins", "O wins", "Draw", null for ongoing)
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically add a timestamp
  },
});

module.exports = mongoose.model("game", gameSchema);
