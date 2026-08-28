// Import Express to create our backend server
const express = require("express");

// Import CORS to allow requests from the React frontend
const cors = require("cors");

// Load variables from the .env file
require("dotenv").config();

// Import our MongoDB connection function
const connectDB = require("./config/db");

// Import authentication routes
const authRoutes = require("./routes/authRoutes");

// Import video routes
const videoRoutes = require("./routes/videoRoutes");

// Import channel routes
const channelRoutes = require("./routes/channelRoutes");

// Import comment routes
const commentRoutes = require("./routes/commentRoutes");


// Connect to MongoDB
connectDB();

// Create Express application
const app = express();

// Allow JSON request bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Use authentication routes with the /api/auth prefix
app.use("/api/auth", authRoutes);

// Use video routes with the /api/videos prefix
app.use("/api/videos", videoRoutes);

// Use channel routes with the /api/channels prefix
app.use("/api/channels", channelRoutes);

// Use comment routes with the /api/comments prefix
app.use("/api/comments", commentRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "YouTube Clone API is running",
  });
});

// Get port from environment variables
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});