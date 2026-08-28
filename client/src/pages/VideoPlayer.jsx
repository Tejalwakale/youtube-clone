// Import React hooks for managing component state and API loading
import { useEffect, useRef, useState } from "react";

// Import routing hooks to get the video ID from the URL
import { Link, useParams } from "react-router-dom";

// Import Axios API instance
import api from "../services/api";

// Video Player page component
const VideoPlayer = () => {
  // Get the video ID from the URL
  const { id } = useParams();

  // Store the selected video
  const [video, setVideo] = useState(null);

  // Store comments belonging to this video
  const [comments, setComments] = useState([]);

  // Store whether the current user is subscribed to the channel
  const [subscribed, setSubscribed] = useState(false);

  // Store new comment text
  const [commentText, setCommentText] = useState("");

  // Store the comment currently being edited
  const [editingCommentId, setEditingCommentId] = useState(null);

  // Store edited comment text
  const [editingText, setEditingText] = useState("");

  // Store loading state
  const [loading, setLoading] = useState(true);

  // Store error messages
  const [error, setError] = useState("");

  // Track whether this video has already counted a view
  const viewCounted = useRef(false);

  // Fetch selected video from backend
  const fetchVideo = async () => {
    try {
      // Request the selected video
      const response = await api.get(`/videos/${id}`);

      // Save video information
      setVideo(response.data);

      // Save the subscription status returned by backend
      setSubscribed(response.data.isSubscribed || false);
    } catch (error) {
      // Display error if video cannot be loaded
      console.error("Unable to load video:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load video."
      );
    }
  };

  // Fetch comments belonging to this video
  const fetchComments = async () => {
    try {
      // Get comments for the selected video
      const response = await api.get(`/comments/video/${id}`);

      // Save comments in state
      setComments(response.data);
    } catch (error) {
      // Keep the page usable even if comments fail
      console.error("Unable to load comments:", error);
    }
  };

  // Fetch video and comments when the video ID changes
  useEffect(() => {
    const loadVideoPage = async () => {
      try {
        // Fetch selected video
        await fetchVideo();

        // Fetch comments
        await fetchComments();
      } finally {
        // Stop showing the loading message
        setLoading(false);
      }
    };

    loadVideoPage();

    // Reset view count when opening a different video
    viewCounted.current = false;
  }, [id]);

  // Increase the view count only once per video page
  const handleVideoView = async () => {
    // Stop if a view has already been counted
    if (viewCounted.current) {
      return;
    }

    try {
      // Mark the view as counted
      viewCounted.current = true;

      // Send request to increase the video view count
      const response = await api.put(`/videos/${id}/view`);

      // Update the view count on the screen
      setVideo((previousVideo) => ({
        ...previousVideo,
        views: response.data.views,
      }));
    } catch (error) {
      // Allow retry if the API request fails
      viewCounted.current = false;

      // Log the error
      console.error("Unable to update video views:", error);
    }
  };

  // Add a new comment
  const handleAddComment = async (event) => {
    // Prevent page refresh
    event.preventDefault();

    // Do not submit an empty comment
    if (!commentText.trim()) {
      return;
    }

    // Get JWT token from localStorage
    const token = localStorage.getItem("token");

    // Check login status before sending the request
    if (!token) {
      alert("Please sign in before commenting.");
      return;
    }

    try {
      // Send new comment to backend
      await api.post(
        "/comments",
        {
          videoId: id,
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear input after successful submission
      setCommentText("");

      // Fetch updated comments
      await fetchComments();
    } catch (error) {
      // Show error in console
      console.error("Unable to add comment:", error);

      // Tell user what happened
      alert(
        error.response?.data?.message ||
        "Unable to add comment."
      );
    }
  };

  // Start editing a comment
  const handleEditStart = (comment) => {
    // Store the comment ID being edited
    setEditingCommentId(comment._id);

    // Put the existing comment text into the edit input
    setEditingText(comment.text);
  };

  // Cancel editing
  const handleEditCancel = () => {
    // Clear the editing comment ID
    setEditingCommentId(null);

    // Clear the editing text
    setEditingText("");
  };

  // Update an existing comment
  const handleEditComment = async (commentId) => {
    // Do not allow an empty comment
    if (!editingText.trim()) {
      return;
    }

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      // Check whether the user is logged in
      if (!token) {
        alert("Please sign in before editing.");
        return;
      }

      // Send updated comment to backend
      await api.put(
        `/comments/${commentId}`,
        {
          text: editingText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Exit editing mode
      handleEditCancel();

      // Refresh comments
      await fetchComments();
    } catch (error) {
      // Show error in console
      console.error("Unable to update comment:", error);

      // Show backend error message
      alert(
        error.response?.data?.message ||
        "Unable to update comment."
      );
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    // Ask the user for confirmation
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    // Stop if user cancels
    if (!confirmed) {
      return;
    }

    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      // Delete comment from backend
      await api.delete(
        `/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh comments
      await fetchComments();
    } catch (error) {
      console.error("Unable to delete comment:", error);

      alert(
        error.response?.data?.message ||
        "Unable to delete comment."
      );
    }
  };

  // Handle like button click
  const handleLike = async () => {
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        alert("Please sign in to like this video.");
        return;
      }

      // Send like request to backend
      const response = await api.put(
        `/videos/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update video counts in React state
      setVideo((previousVideo) => ({
        ...previousVideo,
        likes: response.data.likes,
        dislikes: response.data.dislikes,
      }));
    } catch (error) {
      console.error("Unable to like video:", error);

      alert(
        error.response?.data?.message ||
        "Unable to like video."
      );
    }
  };

  // Handle dislike button click
  const handleDislike = async () => {
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        alert("Please sign in to dislike this video.");
        return;
      }

      // Send dislike request to backend
      const response = await api.put(
        `/videos/${id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update video counts in React state
      setVideo((previousVideo) => ({
        ...previousVideo,
        likes: response.data.likes,
        dislikes: response.data.dislikes,
      }));
    } catch (error) {
      console.error("Unable to dislike video:", error);

      alert(
        error.response?.data?.message ||
        "Unable to dislike video."
      );
    }
  };

  // Handle subscribe / unsubscribe button click
  const handleSubscribe = async () => {
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        alert("Please sign in to subscribe.");
        return;
      }

      // Get the channel ID from the video
      const channelId = video.channelId?._id;

      // Check whether the video has a channel
      if (!channelId) {
        alert("Channel information is unavailable.");
        return;
      }

      // Send subscribe/unsubscribe request to backend
      const response = await api.put(
        `/channels/${channelId}/subscribe`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update subscription state
      setSubscribed(response.data.subscribed);

      // Update subscriber count on screen
      setVideo((previousVideo) => ({
        ...previousVideo,
        channelId: {
          ...previousVideo.channelId,
          subscribers: response.data.subscribers,
        },
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

  // Show loading message
  if (loading) {
    return (
      <p className="page-message">
        Loading video...
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

  // If video doesn't exist
  if (!video) {
    return (
      <p className="page-message">
        Video not found.
      </p>
    );
  }

  return (
    <main className="video-player-page">

      {/* Video player section */}
      <section className="player-section">

        {/* Video element */}
        <video
          className="video-player"
          controls
          poster={video.thumbnailUrl}
          onPlay={handleVideoView}
        >
          {/* Video source stored in MongoDB */}
          <source
            src={video.videoUrl}
            type="video/mp4"
          />

          {/* Browser fallback message */}
          Your browser does not support video playback.
        </video>

        {/* Video title */}
        <h1 className="player-title">
          {video.title}
        </h1>

        {/* Video information */}
        <div className="player-meta">

          {/* Channel name */}
          {video.channelId?._id ? (
            <Link to={`/channel/${video.channelId._id}`}>
              <strong>
                {video.channelId?.channelName ||
                  video.channelName ||
                  "Unknown Channel"}
              </strong>
            </Link>
          ) : (
            <strong>
              {video.channelName || "Unknown Channel"}
            </strong>
          )}

          {/* Views */}
          <span>
            {video.views || 0} views
          </span>

          {/* Subscribe button */}
          <button
            type="button"
            onClick={handleSubscribe}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>

          {/* Subscribers */}
          <span>
            {video.channelId?.subscribers || 0} subscribers
          </span>

        </div>

        {/* Like and dislike buttons */}
        <div className="reaction-buttons">

          <button
            type="button"
            onClick={handleLike}
          >
            👍 Like {video.likes || 0}
          </button>

          <button
            type="button"
            onClick={handleDislike}
          >
            👎 Dislike {video.dislikes || 0}
          </button>

        </div>

        {/* Video description */}
        <div className="video-description">

          <h3>Description</h3>

          <p>
            {video.description ||
              "No description available."}
          </p>

        </div>

      </section>

      {/* Comments section */}
      <section className="comments-section">

        <h2>
          Comments ({comments.length})
        </h2>

        {/* Add comment form */}
        <form
          className="comment-form"
          onSubmit={handleAddComment}
        >

          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(event) =>
              setCommentText(event.target.value)
            }
          />

          <button type="submit">
            Comment
          </button>

        </form>

        {/* Comments list */}
        <div className="comments-list">

          {comments.length === 0 ? (
            <p>
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (

              <div
                className="comment"
                key={comment._id}
              >

                {/* Comment user */}
                <strong>
                  {comment.userId?.username ||
                    comment.username ||
                    "User"}
                </strong>

                {/* Editing mode */}
                {editingCommentId === comment._id ? (

                  <div className="edit-comment">

                    <input
                      type="text"
                      value={editingText}
                      onChange={(event) =>
                        setEditingText(event.target.value)
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleEditComment(comment._id)
                      }
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>

                  </div>

                ) : (

                  <>
                    {/* Normal comment text */}
                    <p>
                      {comment.text}
                    </p>

                    {/* Comment actions */}
                    <div className="comment-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEditStart(comment)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteComment(comment._id)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  </>

                )}

              </div>

            ))
          )}

        </div>

      </section>

      {/* Return to home */}
      <Link
        to="/"
        className="back-home"
      >
        ← Back to Home
      </Link>

    </main>
  );
};

// Export VideoPlayer component
export default VideoPlayer;