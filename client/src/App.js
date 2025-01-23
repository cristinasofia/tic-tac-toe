import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameBoard from "./components/GameBoard";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GameBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
