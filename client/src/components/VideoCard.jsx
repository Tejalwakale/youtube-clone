// Import Link so clicking a video opens the video player page
import { Link } from "react-router-dom";

// VideoCard displays information about one video
const VideoCard = ({ video }) => {
  return (
    <Link
      to={`/video/${video._id}`}
      className="video-card"
    >

      {/* Video thumbnail */}
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="video-thumbnail"
      />

      {/* Video information */}
      <div className="video-info">

        {/* Video title */}
        <h3>{video.title}</h3>

        {/* Channel name */}
        <p>
          {video.channelId?.channelName || "Unknown Channel"}
        </p>

        {/* Number of views */}
        <span>
          {video.views || 0} views
        </span>

      </div>

    </Link>
  );
};

// Export VideoCard component
export default VideoCard;