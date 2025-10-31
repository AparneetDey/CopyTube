

const recommendedVideos = [
  {
    id: 1,
    title: "Become PRO at Backend and System Design",
    channel: "Piyush Garg",
    views: "80K views",
    time: "3 weeks ago",
    duration: "31:05",
    thumbnail: "/backend-development.png",
  },
  {
    id: 2,
    title: "All The JavaScript You Need To Know For React",
    channel: "PedroTech",
    views: "853K views",
    time: "3 years ago",
    duration: "28:00",
    thumbnail: "/javascript-react.jpg",
  },
  {
    id: 3,
    title: "100+ Web Development Things you Should Know",
    channel: "Fireship",
    views: "1.8M views",
    time: "3 years ago",
    duration: "13:18",
    thumbnail: "/web-development-tips.png",
  },
  {
    id: 4,
    title: "Cursor 2.0 – The AI Coding Editor That Might Replace VS ...",
    channel: "Blue Cactus AI",
    views: "3 views",
    time: "57 minutes ago",
    duration: "7:14",
    thumbnail: "/cursor-ai-editor.jpg",
  },
  {
    id: 5,
    title: "JavaScript Global Execution Context Explained!",
    channel: "Piyush Garg",
    views: "44K views",
    time: "11 months ago",
    duration: "27:25",
    thumbnail: "/javascript-context.jpg",
  },
  {
    id: 6,
    title: "I built the same app 10 times // Which JS Framework is best?",
    channel: "Fireship",
    views: "2.7M views",
    time: "4 years ago",
    duration: "21:58",
    thumbnail: "/javascript-frameworks.jpg",
  },
]

export default function RecommendedVideos() {
  return (
    <div className="space-y-3 max-h-screen overflow-y-auto">
      {recommendedVideos.map((video) => (
        <div key={video.id} className="flex gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
          {/* Thumbnail */}
          <div className="relative w-28 h-16 bg-gray-300 rounded shrink-0 overflow-hidden">
            <image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
              {video.duration}
            </div>
          </div>

          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
              {video.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1">{video.channel}</p>
            <p className="text-xs text-gray-600">
              {video.views} • {video.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
