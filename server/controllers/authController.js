// Import the User model to interact with the users collection
const User = require("../models/User");

// Import bcryptjs to securely hash and compare passwords
const bcrypt = require("bcryptjs");

// Import jsonwebtoken to create authentication tokens
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  try {
    // Get username, email, and password from the request body
    const { username, email, password } = req.body;

    // Check whether all required fields were provided
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    // Check whether a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash the password before storing it in MongoDB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the User model
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Send a successful response without exposing the password
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  try {
    // Get email and password from the request body
    const { email, password } = req.body;

    // Check whether both fields were provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find the user using the email address
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare the entered password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    // If the passwords don't match, reject the login
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create a JWT token containing the user's ID
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send the token and basic user information to the frontend
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle unexpected server errors
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Export authentication controller functions
module.exports = {
  registerUser,
  loginUser,
};