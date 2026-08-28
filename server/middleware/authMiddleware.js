// Import jsonwebtoken to verify JWT tokens
const jwt = require("jsonwebtoken");

// Middleware to protect routes that require authentication
const protect = (req, res, next) => {
  try {
    // Get the Authorization header from the request
    const authHeader = req.headers.authorization;

    // Check whether the Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    // Check that the header starts with "Bearer"
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    // Extract the JWT token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store the logged-in user's ID in the request
    req.user = decoded.userId;

    // Continue to the next middleware or controller
    next();
  } catch (error) {
    // Return an error when the token is invalid or expired
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Export the authentication middleware
module.exports = protect;