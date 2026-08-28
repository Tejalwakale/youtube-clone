// Import mongoose to create the Comment schema
const mongoose = require("mongoose");

// Define the structure of a comment document
const commentSchema = new mongoose.Schema(
  {
    // Video to which this comment belongs
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    // User who created the comment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Text written by the user
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    // Automatically create createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the Comment model
module.exports = mongoose.model("Comment", commentSchema);