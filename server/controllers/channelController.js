// Import the Channel model to interact with the channels collection
const Channel = require("../models/Channel");

// Create a new channel
const createChannel = async (req, res) => {
  try {
    // Get channel information from the request body
    const {
      channelName,
      description,
      channelBanner,
    } = req.body;

    // Check whether the channel name was provided
    if (!channelName) {
      return res.status(400).json({
        message: "Channel name is required",
      });
    }

    // Check whether the logged-in user already has a channel
    const existingChannel = await Channel.findOne({
      owner: req.user,
    });

    // Prevent the same user from creating multiple channels
    if (existingChannel) {
      return res.status(400).json({
        message: "You already have a channel",
      });
    }

    // Create a new channel
    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user,
    });

    // Return the newly created channel
    res.status(201).json({
      message: "Channel created successfully",
      channel,
    });
  } catch (error) {
    // Handle errors while creating the channel
    res.status(500).json({
      message: "Failed to create channel",
      error: error.message,
    });
  }
};

// Get a channel by ID
const getChannelById = async (req, res) => {
  try {
    // Get the channel ID from the URL
    const { id } = req.params;

    // Find the channel and include owner and video information
    const channel = await Channel.findById(id)
      .populate("owner", "username email")
      .populate(
        "videos",
        "title description videoUrl thumbnailUrl views category createdAt"
      );

    // Check whether the channel exists
    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // Get subscribed users safely
    const subscribedUsers = channel.subscribedUsers || [];

    // Get logged-in user ID
    const userId = req.user;

    // Check subscription only when a valid user ID exists
    const isSubscribed =
      userId &&
      subscribedUsers.some(
        (subscriberId) =>
          subscriberId &&
          subscriberId.toString() === userId.toString()
      );

    // Return channel information
    res.status(200).json({
      ...channel.toObject(),
      isSubscribed: Boolean(isSubscribed),
    });
  } catch (error) {
    // Print actual error in backend terminal
    console.error("Get channel error:", error);

    // Return error response
    res.status(500).json({
      message: "Failed to fetch channel",
      error: error.message,
    });
  }
};

// Get the logged-in user's own channel
const getMyChannel = async (req, res) => {
  try {
    // Find the channel owned by the logged-in user
    const channel = await Channel.findOne({
      owner: req.user,
    })
      .populate("owner", "username email")
      .populate(
        "videos",
        "title description videoUrl thumbnailUrl views category createdAt"
      );

    // Check whether the user has created a channel
    if (!channel) {
      return res.status(404).json({
        message: "You do not have a channel yet",
      });
    }

    // Get subscribed users safely
    const subscribedUsers = channel.subscribedUsers || [];

    // Check whether the current user is subscribed
    const isSubscribed = subscribedUsers.some(
      (subscriberId) =>
        subscriberId &&
        subscriberId.toString() === req.user.toString()
    );

    // Return channel information
    res.status(200).json({
      ...channel.toObject(),
      isSubscribed,
    });
  } catch (error) {
    // Print actual error in backend terminal
    console.error("Get my channel error:", error);

    // Return error response
    res.status(500).json({
      message: "Failed to fetch your channel",
      error: error.message,
    });
  }
};

// Update a channel
const updateChannel = async (req, res) => {
  try {
    // Get the channel ID from the URL
    const { id } = req.params;

    // Find the channel
    const channel = await Channel.findById(id);

    // Check whether the channel exists
    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // Only the owner can update the channel
    if (channel.owner.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You can only update your own channel",
      });
    }

    // Get updated information from the request
    const {
      channelName,
      description,
      channelBanner,
    } = req.body;

    // Update only the fields that were provided
    if (channelName !== undefined) {
      channel.channelName = channelName;
    }

    if (description !== undefined) {
      channel.description = description;
    }

    if (channelBanner !== undefined) {
      channel.channelBanner = channelBanner;
    }

    // Save the updated channel
    await channel.save();

    // Return the updated channel
    res.status(200).json({
      message: "Channel updated successfully",
      channel,
    });
  } catch (error) {
    // Handle errors while updating the channel
    res.status(500).json({
      message: "Failed to update channel",
      error: error.message,
    });
  }
};

// Subscribe or unsubscribe from a channel
const toggleSubscription = async (req, res) => {
  try {
    // Get the channel ID from the URL
    const { id } = req.params;

    // Find the channel
    const channel = await Channel.findById(id);

    // Check whether the channel exists
    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // Get the logged-in user's ID from JWT
    const userId = req.user;

    // Check whether the user is already subscribed
    const alreadySubscribed = channel.subscribedUsers.some(
      (user) => user.toString() === userId.toString()
    );

    // If already subscribed, unsubscribe
    if (alreadySubscribed) {
      channel.subscribedUsers = channel.subscribedUsers.filter(
        (user) => user.toString() !== userId.toString()
      );

      // Decrease subscriber count
      channel.subscribers = Math.max(0, channel.subscribers - 1);
    } else {
      // Add user to subscribers
      channel.subscribedUsers.push(userId);

      // Increase subscriber count
      channel.subscribers += 1;
    }

    // Save changes to MongoDB
    await channel.save();

    // Return updated subscription information
    res.status(200).json({
      message: alreadySubscribed
        ? "Unsubscribed successfully"
        : "Subscribed successfully",
      subscribed: !alreadySubscribed,
      subscribers: channel.subscribers,
    });
  } catch (error) {
    // Handle subscription errors
    res.status(500).json({
      message: "Failed to update subscription",
      error: error.message,
    });
  }
};

// Export channel controller functions
module.exports = {
  createChannel,
  getChannelById,
  getMyChannel,
  updateChannel,
  toggleSubscription,
};