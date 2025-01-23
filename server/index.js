const express = require("express");
const cors = require("cors");
require("dotenv").config();
// require("dotenv").config({ debug: true });

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");
const aiRoutes = require("./routes/ai");

const { initializeAI } = require("./services/ai");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/game", gameRoutes);
app.use("/ai", aiRoutes);

// Start the server
async function startServer() {
  await initializeAI();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
