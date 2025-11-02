import { AlertCircle, CheckCircle, UploadIcon, Video, X } from 'lucide-react';
import React from 'react'

// Upload Component
const UploadStep = ({ onVideoSelect, videoFile, isUploading, uploadProgress, error }) => {
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            onVideoSelect(file);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 B";
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const value = bytes / Math.pow(1024, i);
        return `${value.toFixed(value < 10 && i > 0 ? 2 : 1)} ${sizes[i]}`;
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 rounded-lg p-2">
                            <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Upload videos</h1>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
                    {!videoFile && !isUploading ? (
                        <div className="text-center">
                            <label className="cursor-pointer">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                        <UploadIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                                        Select files to upload
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                        Or drag and drop video files
                                    </p>
                                    <div className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded font-medium transition text-sm sm:text-base">
                                        SELECT FILES
                                    </div>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>
                            </label>

                            {error && (
                                <div className="mt-4 text-red-600 flex items-center justify-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="text-sm sm:text-base">{error}</span>
                                </div>
                            )}

                            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                                    By submitting your videos to YouTube, you acknowledge that you agree to YouTube's Terms of Service and Community Guidelines.
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Please be sure not to violate others' copyright or privacy rights.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="shrink-0 w-24 h-16 sm:w-32 sm:h-20 bg-gray-200 rounded flex items-center justify-center">
                                    <Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 mb-1 truncate text-sm sm:text-base">
                                        {videoFile?.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        {(videoFile?.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs sm:text-sm text-gray-600">Uploading...</span>
                                    <span className="text-xs sm:text-sm font-medium text-blue-600">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>

                            {uploadProgress === 100 && (
                                <div className="text-center text-green-600 flex items-center justify-center gap-2 text-sm sm:text-base">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Upload complete! Redirecting...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UploadStep