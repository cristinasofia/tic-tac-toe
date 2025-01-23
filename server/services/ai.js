const checkWinner = require("../utils/checkWinner.js");
const tf = require("@tensorflow/tfjs");
const fs = require("fs");

let model;

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
    if (board[a] === "X" && board[b] === "X" && board[c] === null) {
      return c; // Block the winning move
    }
    if (board[a] === "X" && board[c] === "X" && board[b] === null) {
      return b; // Block the winning move
    }
    if (board[b] === "X" && board[c] === "X" && board[a] === null) {
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
      board[i] = "O"; // AI is "O"
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
  if (winner === "O") return 10 - depth; // AI wins
  if (winner === "X") return depth - 10; // Opponent wins
  if (!board.includes(null)) return 0; // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O"; // AI makes a move
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
        board[i] = "X"; // Opponent makes a move
        const score = minimax(board, depth + 1, true);
        board[i] = null; // Undo move
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Difficulty: Hardest
function boardToTensor(board) {
  return board.map((value) => {
    if (value === "O") return 1; // AI's moves
    if (value === "X") return -1; // Player's moves
    return 0; // Empty squares
  });
}

// Define and compile the model
function createModel() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ inputShape: [9], units: 128, activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: 9, activation: "softmax" })); // Output: probabilities for each square
  model.compile({ optimizer: "adam", loss: "categoricalCrossentropy" });
  return model;
}

// Train the model with example data
async function trainModel() {
  const trainData = tf.tensor2d([
    // Example board states (flattened arrays)
    [1, -1, 0, 0, 0, 0, 0, 0, 0], // O's turn
    [-1, 1, 0, 0, 0, 0, 0, 0, 0], // X's turn
    // Add more training data
  ]);

  const trainLabels = tf.tensor2d([
    // Corresponding best moves (as one-hot encoded arrays)
    [0, 0, 1, 0, 0, 0, 0, 0, 0], // O should play at index 2
    [0, 0, 0, 1, 0, 0, 0, 0, 0], // X should play at index 3
    // Add more labels
  ]);

  await model.fit(trainData, trainLabels, { epochs: 100 });
}

function findBestMoveWithAI(board) {
  const tensorBoard = tf.tensor2d([boardToTensor(board)]);
  const predictions = model.predict(tensorBoard).dataSync();

  // Find the index of the highest probability for empty squares
  let bestMove = null;
  let bestScore = -Infinity;
  for (let i = 0; i < predictions.length; i++) {
    if (board[i] === null && predictions[i] > bestScore) {
      bestMove = i;
      bestScore = predictions[i];
    }
  }

  return bestMove;
}

async function initializeAI() {
  model = createModel();
  await trainModel();
}

module.exports = {
  initializeAI,
  findRandomMove,
  findBasicMove,
  findBestMove,
  findBestMoveWithAI,
};
