import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, formatDuration, formatValue } from '../../../functions'
import { Bookmark, EllipsisVertical, Play, Share2 } from 'lucide-react'
import Share, { handleShare } from '../../../../utils/Share'
import { usePlayList } from '../../../context/PlayListContext'

const MainPopularCard = ({ video }) => {
    const {handleOpenPlayList} = usePlayList();

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
            </Link>
            {/* Vidoe Info */}
            <div className='w-full flex justify-between items-center'>
                <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">
                        {video?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {formatValue(video?.views)} views • {formatDate(video?.createdAt)}
                    </p>
                </div>
                <div className='relative'>
                    <div onClick={() => setIsExpanded(!isExpanded)} className='bg-black/0 rounded-full p-2 hover:bg-black/20 transition-all duration-150 ease cursor-pointer'>
                        <EllipsisVertical />
                    </div>

                    {isExpanded && (
                        <div ref={dropDownRef} className="absolute right-0 mt-4 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50">
                            <button
                                onClick={() => handleOpenPlayList(video._id, video.title)}
                                className="px-4 py-3 w-full flex gap-2 items-center cursor-pointer hover:bg-gray-300 transition-all duration-100"
                            >
                                <Bookmark />
                                <p className="text-sm text-gray-500">Save to playlist</p>
                            </button>
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
    )
}

export default MainPopularCard