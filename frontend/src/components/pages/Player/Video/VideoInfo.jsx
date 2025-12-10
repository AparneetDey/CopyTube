import { useEffect, useState } from "react"
import { ThumbsUp, ThumbsDown, Share2, Download, Flag, User } from "lucide-react"
import LoadingSpinner from "../../../loading/LoadingSpinner"
import { useAuth } from "../../../context/AuthContext"
import api from "../../../../services/apiService"
import Share from "../../../../utils/Share"
import { formatDate, formatValue } from "../../../functions"
import { Link } from "react-router-dom"

export default function VideoInfo({ video }) {
  const { user } = useAuth();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribersCount, setSubscribersCount] = useState(0)

  useEffect(() => {
    if (Object.keys(video).length !== 0) {
      setLiked(video.likedBy.includes(user._id))
      setLikes(video.totalLikes || 0)
      setIsSubscribed(video.owner.isSubscribed)
      setSubscribersCount(video.owner.subscribersCount)
    }
  }, [video])

  const toggleLike = async () => {
    try {
      // Optimistic update (immediate UI feedback)
      setLiked(prevLiked => {
        setLikes(prevLikes => prevLiked ? prevLikes - 1 : prevLikes + 1);
        return !prevLiked;
      });

      // API call
      await api.get(`/likes/l/video/${video._id}`);
    } catch (error) {
      console.log("Error toggling like ::", error);

      // Rollback if API fails
      setLiked(prevLiked => {
        setLikes(prevLikes => prevLiked ? prevLikes - 1 : prevLikes + 1);
        return !prevLiked;
      });
    }
  };


  const toggleSubscribe = async () => {
    try {
      const res = await api.get(`/subscriptions/s/${video.owner._id}`);

      setSubscribersCount(prev => isSubscribed ? prev - 1 : prev + 1);
      setIsSubscribed(prev => !prev)
    } catch (error) {
      console.log("Error toggling Subscription ::", error)
    }
  }

  if (Object.keys(video).length === 0) return <LoadingSpinner />

  return (
    <div className="border-t border-gray-200 pt-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>

      {/* Video Stats */}
      <div className="text-sm text-gray-600 mb-4">
        <span>{formatValue(video.views)} views</span>
        <span> • </span>
        <span>{formatDate(video.createdAt)}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${liked ? "bg-blue-200 text-blue-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
        >
          <ThumbsUp className="w-5 h-5" />
          <span>{formatValue(likes)}</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-all">
          <ThumbsDown className="w-5 h-5" />
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-all">
          <Share
            type="video"
            title={video.title}
            url={window.location.href}
            description={`Watch ${video.title} on CopyTube!`}
          />
        </button>
      </div>

      {/* Channel Info */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <Link to={`/channel/${video.owner.username}`}>
          <div className="flex items-center gap-3">
            <div className="shrink-0 cursor-pointer">
              {video?.owner?.avatar ? (
                <img
                  src={video.owner.avatar}
                  alt={video.owner.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 cursor-pointer">{video.owner.fullName || "Unknown"}</h3>
              <p className="text-sm text-gray-600">{formatValue(subscribersCount)} subscribers</p>
            </div>
          </div>
        </Link>

        {(user._id !== video.owner._id) && (
          <button
            onClick={toggleSubscribe}
            className={`px-6 py-2 ${isSubscribed ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-full font-semibold  transition-all cursor-pointer`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}

      </div>

      {/* Description */}
      <div className="text-gray-700">
        <p className={isDescriptionExpanded ? "" : "line-clamp-3"}>
          {video.description}
        </p>
        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="text-blue-600 font-semibold mt-2 hover:text-blue-700"
        >
          {isDescriptionExpanded ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  )
}
