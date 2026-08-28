// Import mongoose to create the User schema
const mongoose = require("mongoose");

// Define the structure of a user document
const userSchema = new mongoose.Schema(
  {
    // Username displayed on the YouTube Clone
    username: {
      type: String,
      required: true,
      trim: true,
    },

    // User's email address used for login
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Hashed password will be stored here
    password: {
      type: String,
      required: true,
    },

    // Optional profile image
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    // Automatically create createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the User model
module.exports = mongoose.model("User", userSchema);