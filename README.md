# tic-tac-toe

## start the server

```
npm run dev
```

server/
├── index.js // Entry point
├── config/
│ └── db.js // MongoDB connection logic
├── middleware/
│ └── auth.js // Authentication middleware (optional)
├── models/
│ └── User.js // User schema
├── routes/
│ ├── auth.js // Signup & Login routes
│ ├── game.js // Game-related routes
│ └── ai.js // AI-related routes
├── services/
│ └── ai.js // AI logic (findBestMove, minimax, etc.)
├── utils/
│ └── checkWinner.js // Helper function to check for a winner
└── .env // Environment variables
