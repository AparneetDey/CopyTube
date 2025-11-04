import React from 'react'
import VideoCard from "./VideoCard"
import { Play } from 'lucide-react';

const HomeTab = ({ videos }) => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Featured Video</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="cursor-pointer group">
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-2">
              <img 
                src={videos[0].thumbnail} 
                alt={videos[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">
              {videos[0].title}
            </h3>
            <p className="text-sm text-gray-600">
              {videos[0].views} views • {videos[0].uploadedAt}
            </p>
          </div>
          <div className="space-y-4">
            {videos.slice(1, 4).map((video, index) => (
              <div key={index} className="flex gap-3 cursor-pointer group">
                <div className="relative w-40 aspect-video bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                    {video.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {video.views} views • {video.uploadedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Uploads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))}
        </div>
      </div>
    );
  }

export default HomeTab