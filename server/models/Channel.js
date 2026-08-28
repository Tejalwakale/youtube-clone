// Import mongoose to create the Channel schema
const mongoose = require("mongoose");

// Define the structure of a channel document
const channelSchema = new mongoose.Schema(
  {
    // Name displayed on the channel page
    channelName: {
      type: String,
      required: true,
      trim: true,
    },

    // User who owns the channel
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Description shown on the channel page
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Banner image displayed at the top of the channel
    channelBanner: {
      type: String,
      default: "",
    },

    // Number of subscribers
    subscribers: {
      type: Number,
      default: 0,
    },

    // Store users who subscribed to this channel
    subscribedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Store references to videos uploaded to this channel
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },

  {
    // Automatically create createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create and export the Channel model
module.exports = mongoose.model("Channel", channelSchema);