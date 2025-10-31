import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, MoreVertical, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@react-hook/media-query"

const initialComments = [
  {
    id: 1,
    author: "John Developer",
    avatar: "J",
    time: "2 weeks ago",
    text: "This video is absolutely fantastic! Finally understood closures properly.",
    likes: 234,
    liked: false,
  },
  {
    id: 2,
    author: "Sarah Code",
    avatar: "S",
    time: "1 week ago",
    text: "Great explanation of the event loop. This should be required viewing for all JS developers.",
    likes: 189,
    liked: false,
  },
  {
    id: 3,
    author: "Mike React",
    avatar: "M",
    time: "3 days ago",
    text: "The async/await section really cleared things up for me. Thanks!",
    likes: 45,
    liked: false,
  },
]

export default function CommentsSection() {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const isMobileOrTablet = useMediaQuery("(max-width: 1024px)");

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "You",
        avatar: "Y",
        time: "now",
        text: newComment,
        likes: 0,
        liked: false,
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const toggleLike = (id) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c)),
    )
  }

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
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
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
          Y
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-600 text-gray-900"
            rows="2"
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
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-600">{comment.time}</span>
                    </div>
                    <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => toggleLike(comment.id)}
                        className={`flex items-center gap-1 text-xs font-semibold transition-all ${comment.liked ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-all">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-all">
                        Reply
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 ml-auto">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
