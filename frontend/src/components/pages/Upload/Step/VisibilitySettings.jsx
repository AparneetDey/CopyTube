import { Eye, Globe, Lock } from 'lucide-react';
import React from 'react'

// Visibility Settings Component
const VisibilitySettings = ({ videoDetails, setVideoDetails, isMobile }) => {
    const handleVisibilityChange = (e) => {
        setVideoDetails(prev => ({ ...prev, visibility: e.target.value }));
    };

    return (
        <div className={`bg-white rounded-lg mt-6 shadow-sm p-4 sm:p-6 ${isMobile ? 'lg:hidden' : 'hidden lg:block'}`}>
            <h3 className="font-medium text-gray-900 mb-4">Visibility</h3>

            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-2">
                <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={videoDetails.visibility === 'public'}
                    onChange={handleVisibilityChange}
                    className="mt-1"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base">Public</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Everyone can watch your video
                    </p>
                </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-2">
                <input
                    type="radio"
                    name="visibility"
                    value="unlisted"
                    checked={videoDetails.visibility === 'unlisted'}
                    onChange={handleVisibilityChange}
                    className="mt-1"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base">Unlisted</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Anyone with the video link can watch
                    </p>
                </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={videoDetails.visibility === 'private'}
                    onChange={handleVisibilityChange}
                    className="mt-1"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base">Private</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Only you can watch your video
                    </p>
                </div>
            </label>
        </div>
    );
}

export default VisibilitySettings