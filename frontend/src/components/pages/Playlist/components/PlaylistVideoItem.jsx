import { MoreVertical, Play } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

// Video Item in Playlist
function PlaylistVideoItem({ video, index, isPlaying, onPlay, onRemove }) {
	const [showMenu, setShowMenu] = useState(false);

	return (
		<div
			className={`flex gap-1 sm:gap-4 p-2 sm:p-4 hover:bg-gray-50 transition cursor-pointer group ${isPlaying ? 'bg-blue-50' : ''
				}`}
			onClick={() => onPlay(video.id)}
		>
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
					{video.duration}
				</div>
			</Link>

			{/* Video Info */}
			<Link className="flex-1 min-w-0">
				<h4 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600">
					{video.title}
				</h4>
				<p className="text-xs text-gray-600 mt-1">{video.channel}</p>
				<p className="text-xs text-gray-600">
					{`${video.views} views`} • {video.uploadedAt}
				</p>
			</Link>

			{/* Menu Button */}
			<div className="relative shrink-0">
				<button
					onClick={(e) => {
						e.stopPropagation();
						setShowMenu(!showMenu);
					}}
					className="hover:bg-gray-200 rounded-full"
				>
					<MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 cursor-pointer" />
				</button>

				{showMenu && (
					<div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl py-2 w-48 border border-gray-200 z-10">
						<button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition">
							Add to queue
						</button>
						<button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition">
							Save to playlist
						</button>
						<button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition">
							Share
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onRemove && onRemove(video.id);
								setShowMenu(false);
							}}
							className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
						>
							Remove from playlist
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default PlaylistVideoItem