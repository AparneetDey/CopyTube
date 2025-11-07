import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate, formatDuration, formatValue } from '../../../functions'
import { Play } from 'lucide-react'

const MainPopularCard = ({video}) => {
    return (
        <Link to={`/watch/${video?._id}`}>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-2 cursor-pointer group">
                <img
                    src={video?.thumbnail}
                    alt={video?.title}
                    className="w-full h-full object-contain"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                    {formatDuration(video?.duration)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                </div>
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">
                {video?.title}
            </h3>
            <p className="text-sm text-gray-600">
                {formatValue(video?.views)} views • {formatDate(video?.createdAt)}
            </p>
        </Link>
    )
}

export default MainPopularCard