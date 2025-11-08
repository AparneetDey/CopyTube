import { Bookmark, EllipsisVertical, Play, Share2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { formatDate, formatDuration, formatValue } from '../../../functions';
import { Link } from 'react-router-dom';
import { handleShare } from '../../../../utils/Share';

const VideoCard = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dropDownRef = useRef(null);

  useEffect(() => {
		const handleClickOutSide = (e) => {
			if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
				setIsExpanded(false)
			}
		}

		window.addEventListener("mousedown", handleClickOutSide);
		return () => {
			window.removeEventListener("mousedown", handleClickOutSide)
		}
	}, [])

  return (
    <div>
      <div className="cursor-pointer group">
        <Link to={`/watch/${video._id}`}>
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
        </Link>

        {/* Video Info */}
        <div className='w-full flex justify-between items-center'>
          <div>
            <h3 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2 mb-1">
              {video.title}
            </h3>
            <div className="text-xs sm:text-sm text-gray-600">
              <span>{formatValue(video.views)} views</span>
              <span className="mx-1">•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>

          <div className='relative'>
            <div onClick={() => setIsExpanded(!isExpanded)} className='bg-black/0 rounded-full p-2 hover:bg-black/20 transition-all duration-150 ease cursor-pointer'>
              <EllipsisVertical />
            </div>

            {isExpanded && (
              <div ref={dropDownRef} className="absolute right-0 mt-4 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50">
                <div className="px-4 py-3 flex gap-2 items-center cursor-pointer hover:bg-gray-300 transition-all duration-100">
                  <Bookmark />
                  <p className="text-sm text-gray-500">Save to playlist</p>
                </div>
                <button
                  onClick={() => handleShare(
                    video.title, `${window.location.origin}/watch/${video._id}`, video.description
                  )}
                  className="px-4 py-3 flex gap-2 items-center cursor-pointer hover:bg-gray-300 w-full transition-all duration-100"
                >
                  <Share2 />
                  <p className="text-sm text-gray-500">Share</p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard