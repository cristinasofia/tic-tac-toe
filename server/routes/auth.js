const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const user = require("../models/user");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Sign-up endpoint
router.post(
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
      const existingUser = await user.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const newUser = new user({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login endpoint
router.post(
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
      const existingUser = await user.findOne({ username });
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

module.exports = router;
