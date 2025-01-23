import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/GameBoard.css";

function GameBoard() {
  const navigate = useNavigate();

  // Retrieve the username from localStorage (or other storage)
  const username = localStorage.getItem("username") || "Guest";

  const [game, setGame] = useState({
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
  });

  useEffect(() => {
    fetch("http://localhost:5001/game")
      .then((res) => res.json())
      .then(setGame);
  }, []);

  const makeMove = (index) => {
    // Prevent moves if game is over
    // or if square is occupied
    if (game.winner || game.board[index] !== null) return;

    fetch("http://localhost:5001/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    })
      .then((res) => res.json())
      .then(setGame);
  };

  const renderSquare = (index) => (
    <button
      className="game-board-button"
      onClick={() => makeMove(index)}
      disabled={game.board[index] !== null}
    >
      {game.board[index]}
    </button>
  );

  const resetGame = () => {
    // Reset the game state on both client and server
    fetch("http://localhost:5001/reset", {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to reset game");
        return res.json();
      })
      .then(setGame)
      .catch((err) => {
        console.error("Error resetting game:", err);
        alert("Failed to reset the game. Please try again.");
      });
  };

  const handleLogout = () => {
    //Remove the token and username from localStorage
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");

    // localStorage.clear();
    // sessionStorage.clear();

    // Redirect to the landing page
    navigate("/");
  };

  return (
    <div className="game-board">
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          {/* Image (Logo) */}
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src="orange.png"
              alt="orange logo"
              style={{ width: "40px", height: "auto", marginRight: "10px" }}
            />
            Welcome, {username}!
          </a>

          {/* Logout Button */}
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="container mt-5">
        <div className="bg-light p-5 rounded">
          <h1 className="text-center mb-4">Tic-Tac-Toe</h1>

          {/* Game Board */}
          <div className="game-board grid">
            {game.board.map((_, index) => renderSquare(index))}
          </div>

          {/* Winner Message */}
          {game.winner && (
            <h2 className="text-center mt-4">
              {game.winner === "Draw"
                ? "It's a Draw!"
                : `Winner: ${game.winner}`}
            </h2>
          )}

          {/* Play Again / Reset Game Button */}
          <div className="text-center mt-3">
            <button
              className={`btn ${game.winner ? "btn-success" : "btn-danger"}`}
              type="button"
              onClick={resetGame}
            >
              {game.winner ? "Play Again" : "Reset Game"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GameBoard;
