const checkWinner = require("../utils/checkWinner.js");

const player1 = "X";
const player2 = "O";

// Difficulty: Easy
function findRandomMove(board) {
  // Get all empty indices
  const emptyIndices = board
    .map((value, index) => (value === null ? index : null))
    .filter((value) => value !== null);

  // Pick a random index from the empty squares
  const randomIndex =
    emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  return randomIndex;
}

// Difficulty: Medium
function findBasicMove(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check if the opponent (X) has a winning move
  for (const [a, b, c] of winningCombinations) {
    if (board[a] === player1 && board[b] === player1 && board[c] === null) {
      return c; // Block the winning move
    }
    if (board[a] === player1 && board[c] === player1 && board[b] === null) {
      return b; // Block the winning move
    }
    if (board[b] === player1 && board[c] === player1 && board[a] === null) {
      return a; // Block the winning move
    }
  }

  // If no blocking is required, make a random move
  return findRandomMove(board);
}

// Difficulty: Hard
function findBestMove(board) {
  let bestScore = -Infinity;
  let bestMove;

  // Loop through all empty squares
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      // Simulate AI move
      board[i] = player2; // AI is "O"
      const score = minimax(board, 0, false); // Call Minimax
      board[i] = null; // Undo move

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinner(board);

  // Base cases
  if (winner === player2) return 10 - depth; // AI wins
  if (winner === player1) return depth - 10; // Opponent wins
  if (!board.includes(null)) return 0; // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = player2; // AI makes a move
        const score = minimax(board, depth + 1, false);
        board[i] = null; // Undo move
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = player1; // Opponent makes a move
        const score = minimax(board, depth + 1, true);
        board[i] = null; // Undo move
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

module.exports = {
  findRandomMove,
  findBasicMove,
  findBestMove,
};
