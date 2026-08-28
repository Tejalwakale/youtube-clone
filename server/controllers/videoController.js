// Import the Video model to interact with the videos collection
const Video = require("../models/Video");

// Import mongoose for ObjectId validation
const mongoose = require("mongoose");

// Import the Channel model so we can check channel ownership
const Channel = require("../models/Channel");

// Get all videos
const getVideos = async (req, res) => {
  try {
    // Get search and category values from the query parameters
    const { search, category } = req.query;

    // Create an empty filter object
    const filter = {};

    // If a search term is provided, search inside the video title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // If a category is provided and it isn't "All", filter by category
    if (category && category !== "All") {
      filter.category = category;
    }

    // Find videos using the filter
    const videos = await Video.find(filter)
      .populate("channelId", "channelName")
      .populate("uploader", "username")
      .sort({ createdAt: -1 });

    // Send the videos to the client
    res.status(200).json(videos);
  } catch (error) {
    // Handle errors while fetching videos
    res.status(500).json({
      message: "Failed to fetch videos",
      error: error.message,
    });
  }
};

// Get a single video by ID
const getVideoById = async (req, res) => {
  try {
    // Get the video ID from the URL
    const { id } = req.params;

    // Find the video and include channel and uploader information
    const video = await Video.findById(id)
      .populate("channelId", "channelName subscribers subscribedUsers")
      .populate("uploader", "username");

    // Check whether the video exists
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Get the logged-in user's ID if available
    const userId = req.user;

    // Check whether the current user subscribed to this channel
    let isSubscribed = false;

    if (userId && video.channelId?.subscribedUsers) {
      isSubscribed = video.channelId.subscribedUsers.some(
        (user) => user.toString() === userId.toString()
      );
    }

    // Return the video
    res.status(200).json({
      ...video.toObject(),
      isSubscribed,
    });
  } catch (error) {
    // Handle invalid IDs or database errors
    res.status(500).json({
      message: "Failed to fetch video",
      error: error.message,
    });
  }
};

// Increase the view count of a video
const addVideoView = async (req, res) => {
  try {
    // Get the video ID from the URL
    const { id } = req.params;

    // Check whether the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid video ID",
      });
    }

    // Find the video using the ID
    const video = await Video.findById(id);

    // Check whether the video exists
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Increase the view count by 1
    video.views += 1;

    // Save the updated video to MongoDB
    await video.save();

    // Return the updated view count
    res.status(200).json({
      message: "Video view added successfully",
      views: video.views,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      message: "Failed to update video views",
      error: error.message,
    });
  }
};

// Create a new video
const createVideo = async (req, res) => {
  try {
    // Get video information from the request body
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      channelId,
      category,
    } = req.body;

    // Check that all required fields are provided
    if (
      !title ||
      !videoUrl ||
      !thumbnailUrl ||
      !channelId ||
      !category
    ) {
      return res.status(400).json({
        message: "Please provide all required video fields",
      });
    }

    // Find the channel
    const channel = await Channel.findById(channelId);

    // Check whether the channel exists
    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // Make sure the logged-in user owns the channel
    if (channel.owner.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You can only add videos to your own channel",
      });
    }

    // Create the video using the authenticated user's ID
    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      channelId,
      uploader: req.user,
      category,
    });

    // Add the video ID to the channel's videos array
    channel.videos.push(video._id);

    // Save the updated channel
    await channel.save();

    // Return the newly created video
    res.status(201).json({
      message: "Video created successfully",
      video,
    });
  } catch (error) {
    // Handle errors while creating a video
    res.status(500).json({
      message: "Failed to create video",
      error: error.message,
    });
  }
};

// Update a video
const updateVideo = async (req, res) => {
  try {
    // Get the video ID from the URL
    const { id } = req.params;

    // Find the video
    const video = await Video.findById(id);

    // Check whether the video exists
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Only the uploader can update the video
    if (video.uploader.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You can only update your own videos",
      });
    }

    // Update only the fields provided by the user
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
    } = req.body;

    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (videoUrl !== undefined) video.videoUrl = videoUrl;
    if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
    if (category !== undefined) video.category = category;

    // Save the updated video
    await video.save();

    // Return the updated video
    res.status(200).json({
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    // Handle errors while updating the video
    res.status(500).json({
      message: "Failed to update video",
      error: error.message,
    });
  }
};

// Delete a video
const deleteVideo = async (req, res) => {
  try {
    // Get the video ID from the URL
    const { id } = req.params;

    // Find the video
    const video = await Video.findById(id);

    // Check whether the video exists
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Only the uploader can delete the video
    if (video.uploader.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You can only delete your own videos",
      });
    }

    // Delete the video
    await Video.findByIdAndDelete(id);

    // Remove the video from the channel's videos array
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: {
        videos: video._id,
      },
    });

    // Return success response
    res.status(200).json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    // Handle errors while deleting the video
    res.status(500).json({
      message: "Failed to delete video",
      error: error.message,
    });
  }
};

// Like a video
const likeVideo = async (req, res) => {
  try {
    // Find the video using the ID from the URL
    const video = await Video.findById(req.params.id);

    // Check if video exists
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Get the logged-in user's ID from JWT
    const userId = req.user;

    // Remove invalid null values from reaction arrays
    video.likedBy = video.likedBy.filter((user) => user);
    video.dislikedBy = video.dislikedBy.filter((user) => user);

    // Check whether the user already liked the video
    const alreadyLiked = video.likedBy.some(
      (user) => user.toString() === userId.toString()
    );

    // Check whether the user previously disliked the video
    const alreadyDisliked = video.dislikedBy.some(
      (user) => user.toString() === userId.toString()
    );

    // If the user already liked the video, remove the like
    if (alreadyLiked) {
      video.likedBy = video.likedBy.filter(
        (user) => user.toString() !== userId.toString()
      );

      video.likes = Math.max(0, video.likes - 1);
    } else {
      // Add the user to likedBy
      video.likedBy.push(userId);

      // Increase like count
      video.likes += 1;

      // If the user previously disliked the video,
      // remove the dislike
      if (alreadyDisliked) {
        video.dislikedBy = video.dislikedBy.filter(
          (user) => user.toString() !== userId.toString()
        );

        video.dislikes = Math.max(0, video.dislikes - 1);
      }
    }

    // Save changes to MongoDB
    await video.save();

    // Return updated counts
    res.status(200).json({
      message: "Like updated successfully",
      likes: video.likes,
      dislikes: video.dislikes,
    });
  } catch (error) {
    console.error("Like error:", error);

    res.status(500).json({
      message: "Unable to update like",
      error: error.message,
    });
  }
};


// Dislike a video
const dislikeVideo = async (req, res) => {
  try {
    // Find the video using the ID from the URL
    const video = await Video.findById(req.params.id);

    // Check if video exists
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Get the logged-in user's ID from JWT
    const userId = req.user;

    // Remove invalid null values from reaction arrays
    video.likedBy = video.likedBy.filter((user) => user);
    video.dislikedBy = video.dislikedBy.filter((user) => user);

    // Check whether the user already disliked the video
    const alreadyDisliked = video.dislikedBy.some(
      (user) => user.toString() === userId.toString()
    );

    // Check whether the user previously liked the video
    const alreadyLiked = video.likedBy.some(
      (user) => user.toString() === userId.toString()
    );

    // If the user already disliked the video, remove the dislike
    if (alreadyDisliked) {
      video.dislikedBy = video.dislikedBy.filter(
        (user) => user.toString() !== userId.toString()
      );

      video.dislikes = Math.max(0, video.dislikes - 1);
    } else {
      // Add the user to dislikedBy
      video.dislikedBy.push(userId);

      // Increase dislike count
      video.dislikes += 1;

      // If the user previously liked the video,
      // remove the like
      if (alreadyLiked) {
        video.likedBy = video.likedBy.filter(
          (user) => user.toString() !== userId.toString()
        );

        video.likes = Math.max(0, video.likes - 1);
      }
    }

    // Save changes to MongoDB
    await video.save();

    // Return updated counts
    res.status(200).json({
      message: "Dislike updated successfully",
      likes: video.likes,
      dislikes: video.dislikes,
    });
  } catch (error) {
    console.error("Dislike error:", error);

    res.status(500).json({
      message: "Unable to update dislike",
      error: error.message,
    });
  }
};

// Export all video controller functions
module.exports = {
  getVideos,
  getVideoById,
  addVideoView,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
};