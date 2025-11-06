import { MoreVertical, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext';
import api from '../../../../services/apiService';
import { formatDate, formatValue } from '../../../functions';

const CommentCard = ({ c }) => {
    const { user } = useAuth()
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if (Object.keys(c).length !== 0) {
            setLiked(c?.likedBy.includes(user._id))
            setLikes(c?.totalLikes)
        }
    }, [c])

    const toggleLike = async (id) => {
        try {
            const res = await api.get(`/likes/l/comment/${id}`);

            if (res.data.success) {
                if (liked) {
                    setLikes((prev) => (
                        prev = prev - 1
                    ))
                    setLiked(false)
                } else {
                    setLikes((prev) => (
                        prev = prev + 1
                    ))
                    setLiked(true)
                }
            }
        } catch (error) {
            console.log("Error toggling like ::", error);
        }
    }

    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-white font-bold text-sm shrink-0">
                <div className="shrink-0">
                    {c?.owner?.avatar ? (
                        <img
                            src={c.owner.avatar}
                            alt={c.owner.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{c.owner.fullName}</span>
                    <span className="text-xs text-gray-600">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-gray-700 text-sm mt-1">{c.content}</p>
                <div className="flex items-center gap-4 mt-2">
                    <button
                        onClick={() => toggleLike(c._id)}
                        className={`flex items-center gap-1 text-xs font-semibold transition-all ${liked ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{formatValue(likes)}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-all">
                        <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 ml-auto">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CommentCard