// Import Express to create channel routes
const express = require("express");

// Import channel controller functions
const {
  createChannel,
  getChannelById,
  getMyChannel,
  updateChannel,
  toggleSubscription,
} = require("../controllers/channelController");

// Import JWT authentication middleware
const protect = require("../middleware/authMiddleware.js");

// Create an Express router
const router = express.Router();

// Create a channel - login required
router.post("/", protect, createChannel);

// Get the logged-in user's own channel - login required
// IMPORTANT: This route must come before /:id
router.get("/my-channel", protect, getMyChannel);

// Get channel information - login required
router.get("/:id", protect, getChannelById);

// Update a channel - login required
router.put("/:id", protect, updateChannel);

// Subscribe or unsubscribe from a channel - login required
router.put("/:id/subscribe", protect, toggleSubscription);

// Export the router
module.exports = router;