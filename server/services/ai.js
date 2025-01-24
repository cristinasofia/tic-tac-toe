const checkWinner = require("../utils/checkWinner.js");
const tf = require("@tensorflow/tfjs-node");
const { loadRecordedGames } = require("../shared/recordedGame.js");

const player1 = "X";
const player2 = "O";

// Difficulty: Expert

// Convert the board into a tensor
function boardToTensor(board) {
  return board.map((value) => {
    if (value === player2) return 1; // AI
    if (value === player1) return -1; // Opponent
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
    // console.log("Board Tensor:", boardTensor);

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
  findBestMoveWithAI,
};
