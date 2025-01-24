const checkWinner = require("../utils/checkWinner.js");
const tf = require("@tensorflow/tfjs-node");
const { loadRecordedGames } = require("../shared/recordedGame.js");

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

// Difficulty: Expert
// Convert the board into a tensor
function boardToTensor(board) {
  return board.map((value) => {
    if (value === player2) return 1;
    if (value === player1) return -1;
    return 0;
  });
}

async function prepareData() {
  console.log("Preparing data...");

  const games = await loadRecordedGames();

  if (!games || games.length === 0) {
    console.log("No recorded games found. Cannot prepare data for training.");
    return {
      trainData: tf.tensor2d([], [0, 9]), // Empty tensor with shape [0, 9]
      trainLabels: tf.tensor2d([], [0, 9]), // Empty tensor with shape [0, 9]
    };
  }

  console.log("Loaded games:", games);

  const boards = [];
  const moves = [];

  games.forEach((game) => {
    const boardTensor = boardToTensor(game.board);
    console.log("Board Tensor:", boardTensor);

    const moveTensor = Array(9).fill(0);
    moveTensor[game.move] = 1; // One-hot encoding for the move

    boards.push(boardTensor);
    moves.push(moveTensor);
  });

  return {
    trainData: tf.tensor2d(boards), // Shape: [numSamples, 9]
    trainLabels: tf.tensor2d(moves), // Shape: [numSamples, 9]
  };
}

// Define and compile the model
function createModel() {
  console.log("Creating model...");

  const model = tf.sequential();
  model.add(
    tf.layers.dense({ inputShape: [9], units: 128, activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: 9, activation: "softmax" })); // 9 outputs for each square
  model.compile({ optimizer: "adam", loss: "categoricalCrossentropy" });
  return model;
}

// Train the model
async function trainModel() {
  console.log("Starting training...");

  const { trainData, trainLabels } = await prepareData();
  const model = createModel();

  // console.log("trainData shape:", trainData.shape);
  // console.log("trainLabels shape:", trainLabels.shape);

  await model.fit(trainData, trainLabels, {
    epochs: 50,
    batchSize: 32,
    shuffle: true,
    verbose: 0,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss.toFixed(4)}`);
      },
    },
  });

  try {
    console.log("Training complete. Saving the model...");
    await model.save("file://../data"); // Save model to disk
    console.log("Model saved successfully.");
  } catch (err) {
    console.error("Error saving model:", err.message);
  }
}

// Load the saved model
async function loadModel() {
  console.log("Loading model...");

  const model = await tf.loadLayersModel("file://../data/model.json");
  console.log("Model loaded successfully.");
  return model;
}

async function findBestMoveWithAI(board) {
  console.log("Thinking...");

  const model = await loadModel();
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
  await trainModel();
}

module.exports = {
  initializeAI,
  findRandomMove,
  findBasicMove,
  findBestMove,
  findBestMoveWithAI,
};
