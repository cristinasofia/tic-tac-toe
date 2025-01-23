const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();
// require("dotenv").config({ debug: true });

const JWT_SECRET = process.env.JWT_SECRET;

const mongoose = require("mongoose");

let gameState = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
};

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://cristinasofia:Maracuy4.@tic-tac-toe.h4vz2.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Login endpoint
app.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if the user exists
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // Compare the password with the hashed password
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: existingUser._id, username: existingUser.username },
        JWT_SECRET,
        {
          expiresIn: "1h", // Token expires in 1 hour
        }
      );

      res.status(200).json({
        message: "Login successful",
        token, // Send the token to the client
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" + JWT_SECRET });
    }
  }
);

// Sign-up endpoint
app.post(
  "/signup",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Route to get current game state
app.get("/game", (req, res) => {
  res.json(gameState);
});

// Route to make move
app.post("/move", (req, res) => {
  const { index } = req.body;

  if (gameState.board[index] === null && !gameState.winner) {
    gameState.board[index] = gameState.currentPlayer;
    gameState.currentPlayer = gameState.currentPlayer == "X" ? "O" : "X";
    gameState.winner = checkWinner(gameState.board);
  }

  res.json(gameState);
});

function checkWinner(board) {
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

  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "Draw";
}

app.post("/reset", (req, res) => {
  gameState = {
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
  };
  res.json(gameState);
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:${PORT}");
});
