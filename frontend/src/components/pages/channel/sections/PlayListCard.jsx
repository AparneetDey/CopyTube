import React, { useEffect, useRef, useState } from 'react'
import { handleShare } from '../../../../utils/Share'
import { EllipsisVertical, List, Play, Share2, Trash } from 'lucide-react'
import { formatDate } from '../../../functions';
import { Link } from 'react-router-dom';
import api from '../../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';

const PlayListCard = ({ playlist, setDeleted }) => {
	const { user } = useAuth();

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

	const handlePlayListDelete = async (id) => {
		try {
			const res = await api.delete(`/playlists/p/delete/${id}`);

			if (res.data.success) {
				setDeleted(true);
			}
		} catch (error) {
			console.log("Something went wrong while deleting the playlist ::", error)
		}
	}

	return (
		<div
			className="cursor-pointer group"
		>
			{/* Playlist Thumbnail Stack */}
			<div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3">
				{playlist.videos && playlist.videos.length > 0 ? (
					<Link>
						{/* Main Thumbnail */}
						<img
							src={playlist.videoDetail[0].thumbnail}
							alt={playlist.name}
							className="w-full h-full object-contain"
						/>

						{/* Overlay with video count */}
						<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
							<div className="text-center">
								<Play className="w-12 h-12 text-white mx-auto mb-2" />
								<p className="text-white font-medium text-sm">Play all</p>
							</div>
						</div>

						{/* Side indicator */}
						<div className="absolute top-0 right-0 bottom-0 w-12 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white">
							<List className="w-5 h-5 mb-1" />
							<span className="text-xs font-medium">{playlist.videoCount}</span>
						</div>
					</Link>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gray-800">
						<div className="text-center text-gray-400">
							<List className="w-12 h-12 mx-auto mb-2" />
							<p className="text-sm">No videos</p>
						</div>
					</div>
				)}
			</div>

			{/* Playlist Info */}
			<div className='w-full flex justify-between items-center'>
				<div>
					<h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 mb-1 hover:text-blue-600 transition">
						{playlist.name}
					</h3>
					<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
						<span>{playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}</span>
					</div>
					{playlist.updatedAt && (
						<p className="text-xs text-gray-500 mt-1">Updated {formatDate(playlist.updatedAt)}</p>
					)}
				</div>

				<div className='relative'>
					<div onClick={() => setIsExpanded(!isExpanded)} className='bg-black/0 rounded-full p-2 hover:bg-black/20 transition-all duration-150 ease cursor-pointer'>
						<EllipsisVertical />
					</div>

					{isExpanded && (
						<div ref={dropDownRef} className="absolute right-0 mt-4 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-50">
							{user?._id === playlist.owner && (
								<button
									onClick={() => handlePlayListDelete(playlist._id)}
									className="px-4 py-3 w-full flex gap-2 items-center cursor-pointer hover:bg-gray-300 transition-all duration-100"
								>
									<Trash />
									<p className="text-sm text-gray-500">Delete playlist</p>
								</button>
							)}
							<button
								onClick={() => handleShare(
									playlist.name, `${window.location.origin}/playlist/${playlist._id}`, playlist.description
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

export default PlayListCard