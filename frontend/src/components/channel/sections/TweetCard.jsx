import { Heart, MessageSquare, Share2 } from 'lucide-react';
import React, { useState } from 'react'

const TweetCard  = ({ tweet }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(tweet.likes);
  
    const handleLike = () => {
      if (isLiked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    };
  
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
        <div className="flex gap-3">
          <img 
            src={tweet.avatar} 
            alt={tweet.name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-900">{tweet.name}</span>
              <span className="text-xs text-gray-500">{tweet.time}</span>
            </div>
            <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">
              {tweet.text}
            </p>
            {tweet.image && (
              <img 
                src={tweet.image} 
                alt="Tweet"
                className="rounded-lg w-full max-h-80 object-cover mb-3"
              />
            )}
            <div className="flex items-center gap-6 text-gray-600">
              <button className="flex items-center gap-1 hover:text-blue-600 transition group">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs">{tweet.replies}</span>
              </button>
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1 transition group ${
                  isLiked ? 'text-red-600' : 'hover:text-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-green-600 transition group">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default TweetCard