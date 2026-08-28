// Import Axios for making HTTP requests
import axios from "axios";

// Create a reusable Axios instance
const api = axios.create({
  // Base URL of our Express backend
  baseURL: "http://localhost:5000/api",
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem("token");

    // Add token to Authorization header if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the updated request configuration
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Export the Axios instance
export default api;