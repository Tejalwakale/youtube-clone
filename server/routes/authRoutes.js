// Import Express to create authentication routes
const express = require("express");

// Import the registration and login controller functions
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

// Create an Express router
const router = express.Router();

// Route for registering a new user
router.post("/register", registerUser);

// Route for logging in an existing user
router.post("/login", loginUser);

// Export the authentication router
module.exports = router;