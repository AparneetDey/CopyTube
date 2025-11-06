import { Heart, MoreHorizontal } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../../services/apiService'
import { formatDate, formatValue } from '../functions'

const TweetCard = ({ t }) => {
	const { owner, createdAt, content, totalLikes } = t;
	const { user } = useAuth()
	const [isLiked, setIsLiked] = useState(false)
	const [likeCount, setLikeCount] = useState(totalLikes)

	useEffect(() => {
		setIsLiked(t.likedBy.includes(user._id))
	}, [])

	const handleLike = async () => {
		try {
			// Optimistically update the UI
			setIsLiked(prevLiked => {
				setLikeCount(prevCount => prevLiked ? prevCount - 1 : prevCount + 1);
				return !prevLiked;
			});

			// API request
			await api.get(`/likes/l/tweet/${t._id}`);
		} catch (error) {
			console.log("Error toggling like ::", error);

			// Rollback if API fails
			setIsLiked(prevLiked => {
				setLikeCount(prevCount => prevLiked ? prevCount - 1 : prevCount + 1);
				return !prevLiked;
			});
		}
	};


	return (
		<div className="border-b border-gray-200 hover:bg-gray-50 transition p-4 cursor-pointer">
			<div className="flex gap-3">
				<div className="shrink-0">
					<img
						src={owner.avatar}
						alt={owner.username}
						className="w-12 h-12 rounded-full object-cover"
					/>
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between mb-1">
						<div className="flex items-center gap-1 flex-wrap">
							<span className="font-bold text-gray-900 hover:underline">
								{owner.fullName}
							</span>
							<span className="text-gray-500">@{owner.username}</span>
							<span className="text-gray-500">·</span>
							<span className="text-gray-500 text-sm">{formatDate(createdAt)}</span>
						</div>
						<button className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full p-1.5 -mr-1.5">
							<MoreHorizontal className="w-5 h-5" />
						</button>
					</div>

					<div className="text-gray-900 mb-3 whitespace-pre-wrap">
						{content}
					</div>

					<div className="flex items-center justify-between max-w-md mt-3">
						<button
							onClick={handleLike}
							className={`flex items-center gap-2 group ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
								}`}
						>
							<div className="group-hover:bg-red-50 rounded-full p-2 -m-2 transition">
								<Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
							</div>
							{likeCount > 0 && (
								<span className="text-sm">{formatValue(likeCount)}</span>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TweetCard