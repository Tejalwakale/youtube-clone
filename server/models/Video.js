// Import mongoose to create the Video schema
const mongoose = require("mongoose");

// Define the structure of a video document
const videoSchema = new mongoose.Schema(
  {
    // Title displayed below the video thumbnail
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Description of the video
    description: {
      type: String,
      default: "",
    },

    // URL of the actual video file
    videoUrl: {
      type: String,
      required: true,
    },

    // URL of the video's thumbnail
    thumbnailUrl: {
      type: String,
      required: true,
    },

    // Reference to the channel that owns this video
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },

    // Reference to the user who uploaded the video
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Number of times the video has been viewed
    views: {
      type: Number,
      default: 0,
    },

    // Number of likes
    likes: {
      type: Number,
      default: 0,
    },

    // Number of dislikes
    dislikes: {
      type: Number,
      default: 0,
    },

    // Users who liked this video
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    ],

    // Users who disliked this video
    dislikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    ],

    // Category used for filtering videos
    category: {
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

// Create and export the Video model
module.exports = mongoose.model("Video", videoSchema);