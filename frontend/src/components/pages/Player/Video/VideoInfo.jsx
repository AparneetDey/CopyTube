import { useState } from "react"
import { ThumbsUp, ThumbsDown, Share2, Download, Flag, User } from "lucide-react"
import LoadingSpinner from "../../../loading/LoadingSpinner"
import {useAuth} from "../../../context/AuthContext"

export default function VideoInfo({ video }) {
  console.log(video)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [likes, setLikes] = useState(101)
  const [liked, setLiked] = useState(false)

  const isSubscribed = video?.owner?.isSubscribed;
  const { user } = useAuth();

  const toggleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  function formatViewsAndSubs(val) {
    if (val < 1000) return val.toString()
    if (val < 1_000_000) return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    if (val < 1_000_000_000) return (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    return (val / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365)

    if (years > 0) return `${years} day${years > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
  }

  if (Object.keys(video).length === 0) return <LoadingSpinner />

  return (
    <div className="border-t border-gray-200 pt-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>

      {/* Video Stats */}
      <div className="text-sm text-gray-600 mb-4">
        <span>{formatViewsAndSubs(video.views)} views</span>
        <span> • </span>
        <span>{formatDate(video.updatedAt)}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${liked ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
        >
          <ThumbsUp className="w-5 h-5" />
          <span>{likes}</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-all">
          <ThumbsDown className="w-5 h-5" />
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-all">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-all">
          <Download className="w-5 h-5" />
          <span>Download</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-all">
          <Flag className="w-5 h-5" />
        </button>
      </div>

      {/* Channel Info */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
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
            <h3 className="font-semibold text-gray-900">{video.owner.fullName || "Unknown"}</h3>
            <p className="text-sm text-gray-600">{formatViewsAndSubs(video.owner.subscribersCount)} subscribers</p>
          </div>
        </div>
        
        {(user._id!==video.owner._id) && (
          <button
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
