import { Download, Eye, Globe, MoreVertical, Play, Share2, Shuffle } from 'lucide-react';
import React, { useState } from 'react'
import { formatDate } from "../../../functions"
import { handleShare } from '../../../../utils/Share';

// Playlist Header Component
function PlaylistHeader({ playlist, onPlayAll, onShuffle }) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  console.log(playlist)

  function getTotalViews(videos) {
    if (!Array.isArray(videos)) return 0;
  
    return videos.reduce((total, video) => {
      const views = Number(video.views) || 0;  // handles undefined, null, strings
      return total + views;
    }, 0);
  }
  

  return (
    <div className="bg-linear-to-br from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Playlist Thumbnail */}
          <div className="shrink-0">
            <div className="relative w-full lg:w-80 aspect-video bg-black/30 rounded-lg overflow-hidden shadow-2xl">
              {playlist.videos && playlist.videos.length > 0 ? (
                <>
                  <img 
                    src={playlist.videos[0].thumbnail} 
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-medium">
                    {playlist.videos.length || 0} videos
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/50" />
                </div>
              )}
            </div>
          </div>

          {/* Playlist Info */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {playlist.name}
            </h1>

            <div className="flex items-center gap-2 mb-1">
              <img 
                src={playlist.owner[0]?.avatar} 
                alt={playlist.owner[0]?.fullName}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{playlist.owner[0]?.fullName}</span>
            </div>
            <div className="flex items-center gap-3 mb-4 text-sm opacity-90">
              <span>{playlist.videos.length} videos</span>
              <span>•</span>
              <span>{getTotalViews(playlist.videos)} views</span>
              <span>•</span>
              <span>Updated {formatDate(playlist.updatedAt)}</span>
            </div>

            <p className="text-sm sm:text-base opacity-90 mb-6 line-clamp-2">
              {playlist.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onPlayAll}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                <span className="text-sm sm:text-base">Play all</span>
              </button>

              <button
                onClick={onShuffle}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white/30 rounded-full font-medium transition"
              >
                <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm sm:text-base">Shuffle</span>
              </button>

              <button 
                onClick={() => handleShare(playlist.name, window.location.href, playlist.description)}
                className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full transition cursor-pointer"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full transition cursor-pointer">
                <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistHeader