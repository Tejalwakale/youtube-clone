// Import mongoose to connect our Node.js application to MongoDB
const mongoose = require("mongoose");

// Create a function that connects our application to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string stored in .env
    const connection = await mongoose.connect(process.env.MONGO_URI);

    // Display the MongoDB host when the connection is successful
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    // Display the error if MongoDB connection fails
    console.error(`MongoDB Connection Error: ${error.message}`);

    // Stop the server if the database connection fails
    process.exit(1);
  }
};

// Export the database connection function
module.exports = connectDB;