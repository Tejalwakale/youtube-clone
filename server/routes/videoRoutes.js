// Import Express to create video routes
const express = require("express");

// Import video controller functions
const {
  getVideos,
  getVideoById,
  addVideoView,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} = require("../controllers/videoController");

// Import JWT authentication middleware
const protect = require("../middleware/authMiddleware.js");

// Create an Express router
const router = express.Router();

// Get all videos
// Search and category filtering are handled using query parameters
router.get("/", getVideos);

// Increase video view count
router.put("/:id/view", addVideoView);

// Get one video by ID - login required
router.get("/:id", getVideoById);

// Create a video - login required
router.post("/", protect, createVideo);

// Update a video - login required
router.put("/:id", protect, updateVideo);

// Delete a video - login required
router.delete("/:id", protect, deleteVideo);

// Like a video
router.put("/:id/like", protect, likeVideo);

// Dislike a video
router.put("/:id/dislike", protect, dislikeVideo);

// Export the router
module.exports = router;