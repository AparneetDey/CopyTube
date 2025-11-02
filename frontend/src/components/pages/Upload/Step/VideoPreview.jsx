import { Video } from 'lucide-react';
import React from 'react'

// Video Preview Sidebar Component
const VideoPreview = ({ videoFile, thumbnailFile, videoDetails }) => {
    return (
        <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-900 mb-4">Video preview</h3>
                <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                    {thumbnailFile ? (
                        <img
                            src={thumbnailFile}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    ) : (
                        <Video className="w-12 h-12 text-gray-600" />
                    )}
                </div>
                <p className="text-sm text-gray-600 mb-2 truncate">{videoFile?.name}</p>
                <p className="text-xs text-gray-500">
                    This is how your video will appear to viewers
                </p>
            </div>
        </div>
    );
}

export default VideoPreview