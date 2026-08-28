// Import React hooks
import { useEffect, useState } from "react";

// Import video API service
import api from "../services/api";

// Import reusable components
import CategoryFilter from "../components/CategoryFilter";
import VideoCard from "../components/VideoCard";

// Home page component
const Home = ({ searchText }) => {

  // Store videos received from the backend
  const [videos, setVideos] = useState([]);

  // Store the selected category
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Store loading state
  const [loading, setLoading] = useState(true);

  // Store API errors
  const [error, setError] = useState("");

  // Fetch videos from the backend
  const fetchVideos = async () => {
    try {
      // Show loading message while fetching
      setLoading(true);

      // Create query parameters
      const params = {};

      // Add search text if provided
      if (searchText) {
        params.search = searchText;
      }

      // Add category if it isn't "All"
      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }

      // Send GET request to the video API
      const response = await api.get("/videos", {
        params,
      });

      // Save the videos in state
      setVideos(response.data);

      // Clear previous errors
      setError("");
    } catch (error) {
      // Display error message if API request fails
      setError("Failed to load videos");
    } finally {
      // Stop loading indicator
      setLoading(false);
    }
  };

  // Fetch videos whenever search or category changes
  useEffect(() => {
    fetchVideos();
  }, [searchText, selectedCategory]);

  return (
    <main className="home-page">

      {/* Category buttons */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Loading message */}
      {loading && <p>Loading videos...</p>}

      {/* Error message and retry button */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchVideos}>Try Again</button>
        </div>
      )}

      {/* Video grid */}
      {!loading && !error && (
        <div className="video-grid">

          {videos.length > 0 ? (

            // Display each video using VideoCard
            videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
              />
            ))

          ) : (

            // Display message when no videos are found
            <p>No videos found.</p>

          )}

        </div>
      )}

    </main>
  );
};

// Export Home page
export default Home;