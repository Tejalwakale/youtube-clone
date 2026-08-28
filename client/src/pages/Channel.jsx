// Import React hooks for managing component state and API loading
import { useEffect, useState } from "react";

// Import routing hooks
import { Link, useParams } from "react-router-dom";

// Import Axios API instance
import api from "../services/api";

// Channel page component
const Channel = () => {
  // Get channel ID from the URL
  const { id } = useParams();

  // Store channel information
  const [channel, setChannel] = useState(null);

  // Store loading state
  const [loading, setLoading] = useState(true);

  // Store error message
  const [error, setError] = useState("");

  // Store the video currently being edited
  const [editingVideo, setEditingVideo] = useState(null);

  // Store edit form data
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "",
  });

  // Store update loading state
  const [updating, setUpdating] = useState(false);

  // Fetch channel information from backend
  const fetchChannel = async () => {
    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      // Get channel by ID
      const response = await api.get(`/channels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Save channel information
      setChannel(response.data);
    } catch (error) {
      console.error("Unable to load channel:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load channel."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch channel when page loads
  useEffect(() => {
    fetchChannel();
  }, [id]);

  // Handle subscribe/unsubscribe
  const handleSubscribe = async () => {
    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        alert("Please sign in to subscribe.");
        return;
      }

      // Call subscribe API
      const response = await api.put(
        `/channels/${id}/subscribe`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update subscriber count and subscription status
      setChannel((previousChannel) => ({
        ...previousChannel,
        subscribers: response.data.subscribers,
        isSubscribed: response.data.subscribed,
      }));
    } catch (error) {
      console.error(
        "Unable to update subscription:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update subscription."
      );
    }
  };

  // Start editing a video
  const handleEditStart = (video) => {
    // Store the selected video
    setEditingVideo(video);

    // Fill the edit form with existing video information
    setEditForm({
      title: video.title || "",
      description: video.description || "",
      videoUrl: video.videoUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
      category: video.category || "",
    });
  };

  // Cancel video editing
  const handleEditCancel = () => {
    // Clear selected video
    setEditingVideo(null);

    // Clear form
    setEditForm({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      category: "",
    });
  };

  // Handle edit form changes
  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Update video
  const handleEditSave = async () => {
    // Make sure a video is selected
    if (!editingVideo) {
      return;
    }

    // Check required fields
    if (
      !editForm.title.trim() ||
      !editForm.videoUrl.trim() ||
      !editForm.thumbnailUrl.trim() ||
      !editForm.category.trim()
    ) {
      alert(
        "Title, video URL, thumbnail URL and category are required."
      );
      return;
    }

    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        alert("Please sign in to update the video.");
        return;
      }

      // Show updating state
      setUpdating(true);

      // Send updated video information to backend
      const response = await api.put(
        `/videos/${editingVideo._id}`,
        {
          title: editForm.title,
          description: editForm.description,
          videoUrl: editForm.videoUrl,
          thumbnailUrl: editForm.thumbnailUrl,
          category: editForm.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get updated video from backend
      const updatedVideo = response.data.video;

      // Update video immediately on the page
      setChannel((previousChannel) => ({
        ...previousChannel,
        videos: previousChannel.videos.map((video) =>
          video._id === updatedVideo._id
            ? updatedVideo
            : video
        ),
      }));

      // Close edit form
      setEditingVideo(null);

      // Clear edit form
      setEditForm({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        category: "",
      });

      // Show success message
      alert(
        response.data.message ||
          "Video updated successfully."
      );
    } catch (error) {
      // Log error
      console.error(
        "Unable to update video:",
        error
      );

      // Show backend error message
      alert(
        error.response?.data?.message ||
          "Failed to update video."
      );
    } finally {
      // Stop updating state
      setUpdating(false);
    }
  };

  // Delete a video
  const handleDeleteVideo = async (videoId) => {
    // Ask user for confirmation
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );

    // Stop if user cancels
    if (!confirmed) {
      return;
    }

    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        alert("Please sign in to delete a video.");
        return;
      }

      // Send delete request to backend
      const response = await api.delete(
        `/videos/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove deleted video immediately
      setChannel((previousChannel) => ({
        ...previousChannel,
        videos: previousChannel.videos.filter(
          (video) => video._id !== videoId
        ),
      }));

      // Show success message
      alert(
        response.data.message ||
          "Video deleted successfully."
      );
    } catch (error) {
      // Log error
      console.error(
        "Unable to delete video:",
        error
      );

      // Show backend error message
      alert(
        error.response?.data?.message ||
          "Unable to delete video."
      );
    }
  };

  // Show loading message
  if (loading) {
    return (
      <p className="page-message">
        Loading channel...
      </p>
    );
  }

  // Show error message
  if (error) {
    return (
      <p className="page-message">
        {error}
      </p>
    );
  }

  // Show message if channel doesn't exist
  if (!channel) {
    return (
      <p className="page-message">
        Channel not found.
      </p>
    );
  }

  return (
    <main className="channel-page">

      {/* Channel banner */}
      <div className="channel-banner">

        {channel.channelBanner ? (
          <img
            src={channel.channelBanner}
            alt={`${channel.channelName} banner`}
          />
        ) : (
          <div className="default-banner">
            Channel Banner
          </div>
        )}

      </div>

      {/* Channel information */}
      <section className="channel-info">

        {/* Channel name */}
        <h1>{channel.channelName}</h1>

        {/* Channel owner */}
        <p>
          @{channel.owner?.username || "Unknown User"}
        </p>

        {/* Subscriber count */}
        <p>
          {channel.subscribers || 0} subscribers
        </p>

        {/* Subscribe button */}
        <button
          type="button"
          onClick={handleSubscribe}
        >
          {channel.isSubscribed
            ? "Subscribed"
            : "Subscribe"}
        </button>

        {/* Channel description */}
        {channel.description && (
          <p className="channel-description">
            {channel.description}
          </p>
        )}

      </section>

      {/* Channel videos */}
      <section className="channel-videos">

        <h2>Videos</h2>

        {channel.videos?.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          <div className="video-grid">

            {channel.videos?.map((video) => (

              <div
                className="video-card"
                key={video._id}
              >

                {/* Open video page */}
                <Link
                  to={`/video/${video._id}`}
                  className="video-link"
                >

                  {/* Video thumbnail */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                  />

                  {/* Video title */}
                  <h3>{video.title}</h3>

                  {/* Video views */}
                  <p>
                    {video.views || 0} views
                  </p>

                </Link>

                {/* Video management buttons */}
                <div className="video-actions">

                  {/* Edit video */}
                  <button
                    type="button"
                    onClick={() =>
                      handleEditStart(video)
                    }
                  >
                    Edit
                  </button>

                  {/* Delete video */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteVideo(video._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

      {/* Edit Video Modal */}
{editingVideo && (
  <div className="edit-modal-overlay">

    <section className="edit-video-modal">

      {/* Modal header */}
      <div className="edit-modal-header">
        <h2>Edit Video</h2>

        <button
          type="button"
          className="close-edit-button"
          onClick={handleEditCancel}
          disabled={updating}
        >
          ✕
        </button>
      </div>

      {/* Edit form */}
      <div className="edit-form">

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={editForm.title}
            onChange={handleEditChange}
            placeholder="Enter video title"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            placeholder="Enter video description"
            rows="4"
          />
        </div>

        {/* Video URL */}
        <div className="form-group">
          <label htmlFor="videoUrl">
            Video URL
          </label>

          <input
            id="videoUrl"
            name="videoUrl"
            type="text"
            value={editForm.videoUrl}
            onChange={handleEditChange}
            placeholder="Enter video URL"
          />
        </div>

        {/* Thumbnail URL */}
        <div className="form-group">
          <label htmlFor="thumbnailUrl">
            Thumbnail URL
          </label>

          <input
            id="thumbnailUrl"
            name="thumbnailUrl"
            type="text"
            value={editForm.thumbnailUrl}
            onChange={handleEditChange}
            placeholder="Enter thumbnail URL"
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            name="category"
            value={editForm.category}
            onChange={handleEditChange}
          >
            <option value="">
              Select Category
            </option>

            <option value="Music">
              Music
            </option>

            <option value="Gaming">
              Gaming
            </option>

            <option value="Education">
              Education
            </option>

            <option value="Technology">
              Technology
            </option>

            <option value="Sports">
              Sports
            </option>

            <option value="Entertainment">
              Entertainment
            </option>

            <option value="News">
              News
            </option>

            <option value="Comedy">
              Comedy
            </option>
          </select>
        </div>

        {/* Form buttons */}
        <div className="edit-actions">

          <button
            type="button"
            onClick={handleEditSave}
            disabled={updating}
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleEditCancel}
            disabled={updating}
          >
            Cancel
          </button>

        </div>

      </div>

    </section>

  </div>
)}

    </main>
  );
};

// Export Channel page
export default Channel;