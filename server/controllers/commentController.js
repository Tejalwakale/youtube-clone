// Import the Comment model to interact with the comments collection
const Comment = require("../models/Comment");

// Import the Video model to check whether the video exists
const Video = require("../models/Video");

// Add a new comment
const addComment = async (req, res) => {
  try {
    // Get the video ID and comment text from the request body
    const { videoId, text } = req.body;

    // Check whether the required fields were provided
    if (!videoId || !text) {
      return res.status(400).json({
        message: "Video ID and comment text are required",
      });
    }

    // Check whether the video exists
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Create a new comment using the logged-in user's ID
    const comment = await Comment.create({
      videoId,
      userId: req.user,
      text,
    });

    // Get the user information along with the comment
    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "username avatar");

    // Return the newly created comment
    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    // Handle errors while adding the comment
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

// Get all comments for a particular video
const getCommentsByVideo = async (req, res) => {
  try {
    // Get the video ID from the URL
    const { videoId } = req.params;

    // Check whether the video exists
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Find all comments belonging to this video
    const comments = await Comment.find({ videoId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    // Return the comments
    res.status(200).json(comments);
  } catch (error) {
    // Handle errors while fetching comments
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    // Get the comment ID from the URL
    const { id } = req.params;

    // Get the updated text from the request body
    const { text } = req.body;

    // Check whether comment text was provided
    if (!text) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    // Find the comment
    const comment = await Comment.findById(id);

    // Check whether the comment exists
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Make sure only the comment owner can edit it
    if (comment.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You can only edit your own comment",
      });
    }

    // Update the comment text
    comment.text = text;

    // Save the updated comment
    await comment.save();

    // Return the updated comment with user information
    const updatedComment = await Comment.findById(comment._id)
      .populate("userId", "username avatar");

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    // Handle errors while updating the comment
    res.status(500).json({
      message: "Failed to update comment",
      error: error.message,
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    // Get the comment ID from the URL
    const { id } = req.params;

    // Find the comment
    const comment = await Comment.findById(id);

    // Check whether the comment exists
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Make sure only the comment owner can delete it
    if (comment.userId.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You can only delete your own comment",
      });
    }

    // Delete the comment from MongoDB
    await Comment.findByIdAndDelete(id);

    // Return a success response
    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    // Handle errors while deleting the comment
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

// Export all comment controller functions
module.exports = {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
};