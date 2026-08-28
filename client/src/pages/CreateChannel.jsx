// Import React state
import { useState } from "react";

// Import navigation hook
import { useNavigate } from "react-router-dom";

// Import Axios API instance
import api from "../services/api";

// Create Channel page
const CreateChannel = () => {
  // Create navigation function
  const navigate = useNavigate();

  // Store channel form data
  const [formData, setFormData] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });

  // Store loading state
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the corresponding form field
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Handle channel creation
  const handleSubmit = async (event) => {
    // Prevent page refresh
    event.preventDefault();

    // Check whether channel name is entered
    if (!formData.channelName.trim()) {
      alert("Please enter a channel name.");
      return;
    }

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        alert("Please sign in to create a channel.");
        navigate("/login");
        return;
      }

      // Show loading state
      setLoading(true);

      // Send channel data to backend
      const response = await api.post(
        "/channels",
        {
          channelName: formData.channelName,
          description: formData.description,
          channelBanner: formData.channelBanner,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message
      alert(
        response.data.message ||
          "Channel created successfully."
      );

      // Get the newly created channel
      const createdChannel = response.data.channel;

      // Navigate to the channel page
      navigate(`/channel/${createdChannel._id}`);
    } catch (error) {
      // Display error in console
      console.error(
        "Unable to create channel:",
        error
      );

      // Display backend error message
      alert(
        error.response?.data?.message ||
          "Unable to create channel."
      );
    } finally {
      // Stop loading state
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    // Return to home page
    navigate("/");
  };

  return (
    <main className="create-channel-page">

      {/* Create channel card */}
      <section className="create-channel-card">

        {/* Page heading */}
        <h1>Create your channel</h1>

        {/* Page description */}
        <p className="create-channel-subtitle">
          Create a channel to share and manage your videos.
        </p>

        {/* Channel form */}
        <form onSubmit={handleSubmit}>

          {/* Channel name */}
          <div className="channel-form-group">

            <label htmlFor="channelName">
              Channel Name
            </label>

            <input
              id="channelName"
              name="channelName"
              type="text"
              value={formData.channelName}
              onChange={handleChange}
              placeholder="Enter channel name"
            />

          </div>

          {/* Channel description */}
          <div className="channel-form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell viewers about your channel"
              rows="5"
            />

          </div>

          {/* Channel banner */}
          <div className="channel-form-group">

            <label htmlFor="channelBanner">
              Channel Banner URL
            </label>

            <input
              id="channelBanner"
              name="channelBanner"
              type="text"
              value={formData.channelBanner}
              onChange={handleChange}
              placeholder="https://example.com/banner.jpg"
            />

          </div>

          {/* Form buttons */}
          <div className="create-channel-actions">

            {/* Create channel button */}
            <button
              type="submit"
              className="create-channel-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Channel"}
            </button>

            {/* Cancel button */}
            <button
              type="button"
              className="cancel-channel-button"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </form>

      </section>

    </main>
  );
};

// Export CreateChannel component
export default CreateChannel;