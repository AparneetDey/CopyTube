import React from 'react'
import { formatDate, formatDuration, formatValue } from '../../../functions'
import { Link } from 'react-router-dom'

const PopularVideoCard = ({ video }) => {
    return (
        <Link to={`/watch/${video._id}`} key={video._id} className="flex gap-3 cursor-pointer group">
            <div className="relative w-40 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-contain"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                    {formatDuration(video.duration)}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                    {video.title}
                </h4>
                <p className="text-xs text-gray-600">
                    {formatValue(video.views)} views • {formatDate(video.createdAt)}
                </p>
            </div>
        </Link>
    )
}

export default PopularVideoCard