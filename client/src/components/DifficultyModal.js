import React from "react";
import { Modal, Button } from "react-bootstrap";

const DifficultyModal = ({ show, onHide, setDifficulty }) => {
  const handleDifficultySelect = (level) => {
    setDifficulty(level); // Pass the selected difficulty level to the parent component
    onHide(); // Close the modal
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Difficulty</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Choose the difficulty level for your game:</p>
        {/* <div className="d-flex justify-content-between gap-2"> */}
        <div className="d-flex flex-column gap-2">
          <Button
            className="w-100"
            variant="success"
            onClick={() => handleDifficultySelect("Easy")}
          >
            Easy
          </Button>
          <Button
            className="w-100"
            variant="warning"
            onClick={() => handleDifficultySelect("Medium")}
          >
            Medium
          </Button>
          <Button
            className="w-100"
            variant="danger"
            onClick={() => handleDifficultySelect("Hard")}
          >
            Hard
          </Button>
          <Button
            className="w-100"
            variant="dark"
            onClick={() => handleDifficultySelect("Expert")}
          >
            Expert
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DifficultyModal;
