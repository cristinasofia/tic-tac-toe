const express = require("express");
const checkWinner = require("../utils/checkWinner.js");
const {
  getGameState,
  resetGameState,
  updateGameState,
} = require("../shared/gameState.js");
const { saveRecordMove } = require("../shared/recordedGame.js");

const router = express.Router();

// Route to get current game state
router.get("/", (req, res) => {
  res.json(getGameState());
});

// router.get("/game", (req, res) => {
//   res.json(gameState);
// });

// Route to make move
router.post("/move", (req, res) => {
  const { index } = req.body;
  const gameState = getGameState();

  if (gameState.board[index] === null && !gameState.winner) {
    gameState.board[index] = gameState.currentPlayer;
    gameState.currentPlayer = "O";
    gameState.winner = checkWinner(gameState.board);
    updateGameState(gameState);
    saveRecordMove(gameState.board, index, gameState.winner);
  }

  res.json(getGameState());
});

router.post("/reset", (req, res) => {
  resetGameState();
  res.json(getGameState());
});

module.exports = router;
