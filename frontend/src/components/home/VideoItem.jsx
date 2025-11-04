import React, { useState, useRef, useEffect } from 'react'
import { Video, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoItem = ({ v }) => {
  const {title, owner, thumbnail, videoFile, duration, views, createdAt} = v;
  const [hoverTimer, setHoverTimer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const numSeconds = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
    const hours = Math.floor(numSeconds / 3600);
    const minutes = Math.floor((numSeconds % 3600) / 60);
    const secs = Math.floor(numSeconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365)
  
    if (years > 0) return `${years} day${years > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
  }

  function formatViews(views) {
    if (views < 1000) return views.toString()
    if (views < 1_000_000) return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    if (views < 1_000_000_000) return (views / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    return (views / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
  } 
  
  const handleMouseEnter = () => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 1000); // Start playing after 1 second of hover
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    } else if (!isPlaying && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className=' cursor-pointer '>
      {/* Thumbnail Container */}
      <Link
        to={`/watch/${v._id}`} 
        className="block relative w-full bg-black rounded-xl overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail or Video Preview */}
        <div className="relative w-full aspect-video">
          {thumbnail && (
            <img 
              src={thumbnail} 
              alt={title}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
                isPlaying ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}
          {!thumbnail && (
            <div className={`absolute inset-0 w-full h-full flex items-center justify-center bg-gray-900 transition-opacity duration-500 ease-in-out ${
              isPlaying ? 'opacity-0' : 'opacity-100'
            }`}>
              <Video className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          {isPlaying && (
            <video 
              ref={videoRef}
              src={videoFile} 
              playsInline 
              muted
              loop
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out opacity-100" 
            />
          )}
        </div>
        
        {/* Duration Badge */}
        {!isPlaying && duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
            {formatDuration(duration)}
          </div>
        )}
      </Link>
      
      {/* Video Info */}
      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <div className="shrink-0">
          {owner?.avatar ? (
            <img 
              src={owner.avatar} 
              alt={owner.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>
        
        {/* Video Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-1">
            {title}
          </h3>
          <p className="text-xs text-gray-600 hover:text-gray-900 mb-0.5">
            {owner?.fullName || 'Unknown Channel'}
          </p>
          <div className="flex items-center text-xs text-gray-600">
            <span>{formatViews(views) || '0'} views</span>
            <span className="mx-1">•</span>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoItem