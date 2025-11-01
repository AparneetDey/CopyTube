import { useState, useEffect, useCallback } from "react"
import { ThumbsUp, ThumbsDown, MoreVertical, ChevronDown, ChevronUp, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@react-hook/media-query"
import { useAuth } from "../../../context/AuthContext"
import api from "../../../../services/apiService"
import CommentCard from "./CommentCard"

export default function CommentsSection({ video }) {
  const { user } = useAuth();

  const [comments, setComments] = useState({})
  const [newComment, setNewComment] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobileOrTablet = useMediaQuery("(max-width: 1024px)");

  const fetchVideoComments = useCallback(async () => {
    try {
      const res = await api.get(`/comments/c/${video?._id}`);

      setComments(res.data.data.comments);
    } catch (error) {
      console.log(error);
    }
  }, [video._id])

  useEffect(() => {
    if (video?._id) {
      fetchVideoComments();
    }
  }, [fetchVideoComments, video._id])

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const formData = {
        content: newComment,
        videoId: video._id,
      }

      try {
        const res = await api.post(`/comments/c/${video._id}`, formData, {
          "headers": "application/json"
        });

        if (res.data.success) {
          setNewComment("");
          fetchVideoComments();
        }
      } catch (error) {
        console.log("Error posting comment ::", error);
      }
    }
  }

  return (
    <div className="border-t border-gray-200 pt-6 mt-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{comments.length} Comments</h2>

        {/* Only show toggle on mobile/tablet */}
        {isMobileOrTablet && (
          <button
            className="flex items-center text-gray-700 text-sm font-medium"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? (
              <>
                Hide <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Show <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Add Comment */}
      <div className="flex gap-4 mb-6">
        <div className="shrink-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-600 text-gray-900"
            rows="3"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setNewComment("")}
              className="px-4 py-2 text-gray-900 hover:bg-gray-200 rounded-full font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {(isExpanded || !isMobileOrTablet) && (
          <motion.div
            key="comments"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Comments List */}
            <div className="space-y-4">
              {comments.length>0 && comments?.map((comment) => (
                <CommentCard key={comment._id} c={comment} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
