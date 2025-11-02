import { CheckCircle, Globe } from 'lucide-react';
import React from 'react'

// Success Component
const SuccessScreen = ({ videoDetails, onUploadAnother }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Video published!</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Your video is now live and available to viewers
                </p>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left">
                    <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{videoDetails.title}</h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span className="capitalize">{videoDetails.visibility}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button className="w-full px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm sm:text-base">
                        View on YouTube
                    </button>
                    <button
                        onClick={onUploadAnother}
                        className="w-full px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition text-sm sm:text-base"
                    >
                        Upload another video
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SuccessScreen