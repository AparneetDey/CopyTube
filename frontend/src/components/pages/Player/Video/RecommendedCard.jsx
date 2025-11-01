import React from 'react'
import { Link } from 'react-router-dom';

const RecommendedCard = ({ video }) => {
    const formatDuration = (seconds) => {
        if (!seconds) return '';
        const numSeconds = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
        const hours = Math.floor(numSeconds / 3600);
        const minutes = Math.floor((numSeconds % 3600) / 60);
        const secs = Math.floor(numSeconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

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

    return (
        <Link to={`/video/${video._id}`} className="flex gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
            {/* Thumbnail */}
            <div
                className="block relative w-28 h-16 bg-black rounded shrink-0 overflow-hidden"
            >
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-contain"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                </div>
            </div>


            {/* Video Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                    {video.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{video.channel}</p>
                <p className="text-xs text-gray-600">
                    {formatViewsAndSubs(video.views)} • {formatDate(video.updatedAt)}
                </p>
            </div>
        </Link>
    )
}

export default RecommendedCard