# **Tic-Tac-Toe with AI**

A Tic-Tac-Toe web application where the player (you) can compete against an AI opponent. The app features multiple difficulty levels, ranging from easy (random moves) to expert (TensorFlow-based logic).

---

## **Features**

- 🔑 **User Authentication**: Users can sign up, log in, and have their game sessions saved securely.
- 🎮 **Game Modes**:
  - Player vs AI with three difficulty levels:
    - Easy: Random moves.
    - Medium: Rule-based logic.
    - Hard: Minimax algorithm.
    - Expert: TensorFlow-based AI.
  - Reset and track progress for each game.
- 🧠 **AI Learning**:
  - Recorded games are stored in MongoDB to train the TensorFlow AI for the hardest mode.
- 🎨 **Responsive Design**: Built with **Bootstrap**, making it mobile-friendly and modern.
- ⚙️ **Tech Stack**:
  - Frontend: React.js, Bootstrap
  - Backend: Node.js, Express.js, MongoDB
  - AI: TensorFlow.js, Minimax algorithm

---

## **Getting Started**

### **Prerequisites**

- **Node.js**: `>=16.x`
- **MongoDB**: Installed locally or a cloud-based service like MongoDB Atlas
- **npm**: Included with Node.js

### **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/cristinasofia/tic-tac-toe.git
   cd tic-tac-toe
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:

   ```bash
   JWT_SECRET=your_secret_key
   MONGO_URI=your_mongo_connection_string
   ```

4. Start the MongoDB server (if running locally).

5. Run the development server:
   ```bash
   npm run dev
   ```

---

## **Usage**

### **Playing the Game**

1. Sign up or log in
2. Choose a difficulty level from the modal that appears after starting the game
3. Play against the AI

### **AI Training**

1. Game records are saved automatically to MongoDB
<!-- 2. Use the `/ai/train` endpoint (or modify the backend) to train the AI with saved games using TensorFlow.js -->

---

## **Folder Structure**

```
├── server/                # Backend server code
│   ├── config             # Database config
│   ├── models/            # Mongoose models (e.g., User, Game)
│   ├── routes/            # API routes
│   ├── services/          # Board moves and AI-related logic (e.g., Minimax, TensorFlow)
│   ├── shared/            # Shared utilities (e.g., game state)
│   ├── utils/             # Helper functions (e.g., winner checking)
│   └── index.js           # Entry point for the server
├── client/                # Frontend code
│   ├── src/
│   │   ├── assets/        # Images, styles, etc.
│   │   ├── components/    # React components (e.g., GameBoard, Modals)
│   │   ├── App.js         # Main React application
│   │   └── index.js       # Entry point for React
├── .env                   # Environment variables
├── package.json           # Node.js dependencies
└── README.md              # Project documentation
```

---

## **Endpoints**

### **Authentication**

- **POST `/signup`**: Create a new user
- **POST `/login`**: Authenticate a user and return a JWT token

### **Game State**

- **GET `/game`**: Retrieve the current game state
- **POST `/move`**: Make a player move
- **POST `/reset`**: Reset the game board

### **AI**

- **POST `/ai/move`**: Get AI's next move based on difficulty
<!-- - **POST `/ai/train`**: Train the AI using recorded games -->

---

## **AI Logic**

### **Easy Mode**

The AI picks a random empty square

### **Medium Mode**

The AI blocks the player’s winning move or makes a random move

### **Hard Mode**

The AI uses the **Minimax Algorithm** to find the optimal move

### **Expert Mode**

The AI uses **TensorFlow.js** to learn from previously recorded games (and hopefully improves over time)

---

## **Future Enhancements**

- [ ] Add multiplayer support.
- [ ] Implement player statistics and leaderboards.
- [ ] Improve the TensorFlow model with more complex training data.
- [ ] Introduce animations for moves.

---

## **Contributing**

Contributions are welcome! To get started:

1. Fork this repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add a new feature'`.
4. Push the branch: `git push origin feature-name`.
5. Open a pull request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**

For any questions, feel free to reach out:

- **Email**: cristinasofiaalonso@gmail.com
- **GitHub**: [cristinasofia](https://github.com/cristinasofia)
