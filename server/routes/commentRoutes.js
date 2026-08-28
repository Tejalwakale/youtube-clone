// Import Express to create comment routes
const express = require("express");

// Import comment controller functions
const {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

// Import JWT authentication middleware
const protect = require("../middleware/authMiddleware.js");

// Create an Express router
const router = express.Router();

// Add a comment - login required
router.post("/", protect, addComment);

// Get comments for a video - public route
router.get("/video/:videoId", getCommentsByVideo);

// Update a comment - login required
router.put("/:id", protect, updateComment);

// Delete a comment - login required
router.delete("/:id", protect, deleteComment);

// Export the comment router
module.exports = router;