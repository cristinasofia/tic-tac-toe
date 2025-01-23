// gameState.js
let gameState = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
};

module.exports = {
  getGameState: () => gameState,
  resetGameState: () => {
    gameState = {
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
    };
  },
  updateGameState: (newState) => {
    gameState = { ...gameState, ...newState };
  },
};
