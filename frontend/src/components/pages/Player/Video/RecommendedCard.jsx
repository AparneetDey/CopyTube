import React from 'react'
import { Link } from 'react-router-dom';
import { formatDate, formatDuration, formatValue } from '../../../functions';

const RecommendedCard = ({ video }) => {

    return (
        <Link to={`/watch/${video._id}`} className="flex gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
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
                    {formatValue(video.views)} • {formatDate(video.createdAt)}
                </p>
            </div>
        </Link>
    )
}

export default RecommendedCard