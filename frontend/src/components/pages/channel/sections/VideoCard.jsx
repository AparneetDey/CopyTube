import { Play } from 'lucide-react';
import React from 'react'
import { formatDate, formatDuration, formatValue } from '../../../functions';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/watch/${video._id}`}>
      <div className="cursor-pointer group">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-2">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <h3 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2 mb-1">
          {video.title}
        </h3>
        <div className="text-xs sm:text-sm text-gray-600">
          <span>{formatValue(video.views)} views</span>
          <span className="mx-1">•</span>
          <span>{formatDate(video.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard