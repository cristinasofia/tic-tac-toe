const express = require("express");
const {
  findRandomMove,
  findBasicMove,
  findBestMove,
  findBestMoveWithAI,
} = require("../services/ai");
const { getGameState, updateGameState } = require("../shared/gameState.js");
const { saveRecordMove } = require("../shared/recordedGame.js");
const checkWinner = require("../utils/checkWinner.js");

const router = express.Router();

router.post("/move", async (req, res) => {
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
  } else if (difficulty === "Expert") {
    // TensorFlow / ML-Based AI
    aiMove = await findBestMoveWithAI(gameState.board);
  }

  if (gameState.board[aiMove] === null && !gameState.winner) {
    gameState.board[aiMove] = gameState.currentPlayer;
    gameState.currentPlayer = "X";
    gameState.winner = checkWinner(gameState.board);
    updateGameState(gameState);
    saveRecordMove(gameState.board, aiMove, gameState.winner);
  }

  res.json(getGameState());
});

module.exports = router;
