// Import navigation hook
import { useNavigate } from "react-router-dom";

// Import Axios API instance
import api from "../services/api";

// Sidebar component
const Sidebar = ({ isOpen }) => {
  // Create navigation function
  const navigate = useNavigate();

  // Handle "Your channel" click
const handleMyChannel = async () => {
  try {
    // Get JWT token
    const token = localStorage.getItem("token");

    // User must be logged in
    if (!token) {
      alert("Please sign in to view your channel.");
      navigate("/login");
      return;
    }

    // Get the logged-in user's channel
    const response = await api.get("/channels/my-channel", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Get the channel ID
    const channelId = response.data._id;

    // Open the user's channel
    navigate(`/channel/${channelId}`);
  } catch (error) {
    // Check whether the user has not created a channel yet
    if (error.response?.status === 404) {
      navigate("/create-channel");
      return;
    }

    // Log unexpected errors
    console.error("Unable to load your channel:", error);

    // Show error message
    alert(
      error.response?.data?.message ||
        "Unable to load your channel."
    );
  }
};

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>

      {/* ==================== MAIN MENU ==================== */}

      {/* Home */}
      <button
        type="button"
        className="sidebar-link"
        onClick={() => navigate("/")}
      >
         Home
      </button>

      {/* Shorts - UI only */}
      <div className="sidebar-link">
         Shorts
      </div>

      {/* Subscriptions - UI only */}
      <div className="sidebar-link">
         Subscriptions
      </div>


      {/* ==================== YOU SECTION ==================== */}

      <div className="sidebar-section">

        {/* Section heading */}
        <h3>You</h3>

        {/* Your Channel */}
        <button
          type="button"
          className="sidebar-link"
          onClick={handleMyChannel}
        >
           Your channel
        </button>

        {/* Create Channel */}
        <button
          type="button"
          className="sidebar-link"
          onClick={() => navigate("/create-channel")}
        >
            Create channel
        </button>

        {/* History - UI only */}
        <div className="sidebar-link">
          History
        </div>

        {/* Playlists - UI only */}
        <div className="sidebar-link">
           Playlists
        </div>

        {/* Watch Later - UI only */}
        <div className="sidebar-link">
           Watch later
        </div>

        {/* Liked Videos - UI only */}
        <div className="sidebar-link">
           Liked videos
        </div>

        {/* Your Videos - UI only */}
        <div className="sidebar-link">
           Your videos
        </div>

        {/* Downloads - UI only */}
        <div className="sidebar-link">
           Downloads
        </div>

      </div>


      {/* ==================== EXPLORE SECTION ==================== */}

      <div className="sidebar-section">

        {/* Section heading */}
        <h3>Explore</h3>

        {/* Shopping - UI only */}
        <div className="sidebar-link">
           Shopping
        </div>

        {/* Music - UI only */}
        <div className="sidebar-link">
           Music
        </div>

        {/* Movies & TV - UI only */}
        <div className="sidebar-link">
           Movies & TV
        </div>

        {/* Show More - UI only */}
        <div className="sidebar-link">
           Show more
        </div>

      </div>

    </aside>
  );
};

// Export Sidebar component
export default Sidebar;