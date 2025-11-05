import { Settings, Share2 } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from "../../../context/AuthContext"

const ChannelHeader = ({ channel, stats, onAvatarChange, onBannerChange }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(channel?.isSubscribed);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showBannerUpload, setShowBannerUpload] = useState(false);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange(reader.result);
        setShowAvatarUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onBannerChange(reader.result);
        setShowBannerUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white">
      {/* Banner */}
      <div
        className="w-full h-32 sm:h-48 md:h-64 bg-linear-to-r from-blue-400 to-purple-500 relative overflow-hidden group cursor-pointer"
        onMouseEnter={() => setShowBannerUpload(true)}
        onMouseLeave={() => setShowBannerUpload(false)}
      >
        {channel?.coverImage && (
          <img
            src={channel.coverImage}
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
        )}

        {/* Banner Upload Overlay */}
        {(showBannerUpload || !channel?.coverImage) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
            <label className="cursor-pointer">
              <div className="bg-white bg-opacity-90 hover:bg-opacity-100 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 transition">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                <span className="text-sm sm:text-base font-medium text-gray-700">Change Banner</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Channel Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div
            className="relative -mt-12 sm:-mt-16 group cursor-pointer"
            onMouseEnter={() => setShowAvatarUpload(true)}
            onMouseLeave={() => setShowAvatarUpload(false)}
          >
            <img
              src={channel.avatar}
              alt={channel.username}
              className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-lg"
            />

            {/* Avatar Upload Overlay */}
            {showAvatarUpload && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer transition-opacity">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Channel Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  {channel.fullName}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                  <span>@{channel.username}</span>
                  <span>•</span>
                  <span>{channel.subscribersCount || 0} subscribers</span>
                  <span>•</span>
                  <span>{stats.totalVideos || 0} videos</span>
                  <span>•</span>
                  <span>{stats.totalTweets || 0} tweets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {user._id !== channel._id && (
              <button
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-full font-medium transition ${isSubscribed
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChannelHeader