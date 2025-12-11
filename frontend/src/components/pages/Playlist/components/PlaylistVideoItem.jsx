import { Bookmark, MoreVertical, Play, Share2, Trash } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { formatDate, formatDuration } from '../../../functions';
import { handleShare } from '../../../../utils/Share';
import { usePlayList } from '../../../context/PlayListContext';

// Video Item in Playlist
function PlaylistVideoItem({ video, index, isPlaying, onPlay, onRemove }) {
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
		<div className={`flex gap-1 sm:gap-4 p-2 sm:p-4 hover:bg-gray-50 transition cursor-pointer group ${isPlaying ? 'bg-blue-50' : ''}`}>
			{/* Index / Playing Indicator */}
			<div className="shrink-0 w-3 sm:w-8 flex items-start pt-1">
				{isPlaying ? (
					<div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8">
						<div className="flex gap-1">
							<div className="w-1 h-3 bg-blue-600 animate-pulse" style={{ animationDelay: '0s' }}></div>
							<div className="w-1 h-3 bg-blue-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
							<div className="w-1 h-3 bg-blue-600 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
						</div>
					</div>
				) : (
					<span className="text-sm sm:text-base text-gray-600 group-hover:hidden">{index}</span>
				)}
				<Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hidden group-hover:block" fill="currentColor" />
			</div>

			{/* Thumbnail */}
			<Link className="block relative w-28 h-16 bg-black rounded shrink-0 overflow-hidden">
				<img
					src={video.thumbnail}
					alt={video.title}
					className="absolute inset-0 w-full h-full object-contain"
				/>
				<div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
					{formatDuration(video.duration)}
				</div>
			</Link>

			{/* Video Info */}
			<Link className="flex-1 min-w-0">
				<h4 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600">
					{video.title}
				</h4>
				<p className="text-xs text-gray-600 mt-1">{video.channel}</p>
				<p className="text-xs text-gray-600">
					{`${video.views} views`} • {formatDate(video.createdAt)}
				</p>
			</Link>

			{/* Menu Button */}
			<div className="relative shrink-0">
				<button
					onClick={(e) => {
						e.stopPropagation();
						setIsExpanded(!isExpanded);
					}}
					className="hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
				>
					<MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 cursor-pointer" />
				</button>

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
						<button
							onClick={() => handleShare(
								video.title, `${window.location.origin}/watch/${video._id}`, video.description
							)}
							className="px-4 py-3 flex gap-2 items-center cursor-pointer hover:bg-gray-300 w-full transition-all duration-100"
						>
							<Trash />
							<p className="text-sm text-red-500">Remove</p>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default PlaylistVideoItem