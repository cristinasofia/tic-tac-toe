const express = require("express");
const checkWinner = require("../utils/checkWinner.js");
const {
  findRandomMove,
  findBasicMove,
  findBestMove,
  findBestMoveWithAI,
} = require("../services/ai");
const { getGameState, updateGameState } = require("../shared/gameState.js");

const router = express.Router();

router.post("/move", (req, res) => {
  const { difficulty } = req.body;
  const gameState = getGameState();

  //   Check for a winner or full board
  gameState.winner = checkWinner(gameState.board);
  if (gameState.winner || !gameState.board.includes(null)) {
    return res.json({ winner: gameState.winner });
  }

  let aiMove;
  if (difficulty === "Easy") {
    // Random move logic
    aiMove = findRandomMove(gameState.board);
  } else if (difficulty === "Medium") {
    // Basic logic
    aiMove = findBasicMove(gameState.board);
  } else if (difficulty === "Hard") {
    // Minimax logic
    aiMove = findBestMove(gameState.board);
  } else if (difficulty === "Hardest") {
    // TensorFlow / ML-Based AI
    aiMove = findBestMoveWithAI(gameState.board);
  }

  if (gameState.board[aiMove] === null && !gameState.winner) {
    gameState.board[aiMove] = gameState.currentPlayer;
    gameState.currentPlayer = "X";
    gameState.winner = checkWinner(gameState.board);
    updateGameState(gameState);
  }

  res.json(getGameState());
});

module.exports = router;
