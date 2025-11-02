import { Globe, Loader } from 'lucide-react';
import React from 'react'

// Publishing Progress Component
const PublishingProgress = ({ progress, videoDetails }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-spin" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Publishing video...</h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        Please wait while we process your video
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm text-gray-600">Upload progress</span>
                        <span className="text-xs sm:text-sm font-medium text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base truncate">
                        {videoDetails.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span className="capitalize">{videoDetails.visibility}</span>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    Don't close this window until the upload is complete
                </p>
            </div>
        </div>
    );
}

export default PublishingProgress