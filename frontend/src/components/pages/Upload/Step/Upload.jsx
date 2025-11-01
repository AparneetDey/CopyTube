import { CheckCircle, UploadIcon, Video, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Upload = ({ videoFile, setVideoFile, errors, setErrors, setStep }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Handle video file selection
    const handleVideoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                setErrors({ video: 'Please select a valid video file' });
                return;
            }

            if (file.size > 500 * 1024 * 1024) { // 500MB limit
                setErrors({ video: 'Video file must be less than 500MB' });
                return;
            }

            setVideoFile(file);
            setErrors({});
        }
    };


    useEffect(() => {
        if (videoFile) {
            simulateUpload();
        }
    }, [videoFile]);


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 rounded-lg p-2">
                            <Video className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900">Upload videos</h1>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Upload Area */}
                <div className="bg-white rounded-lg shadow-sm p-12">
                    {!videoFile && !isUploading ? (
                        <div className="text-center">
                            <label className="cursor-pointer">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                        <UploadIcon className="w-16 h-16 text-gray-400" />
                                    </div>
                                    <h2 className="text-xl font-medium text-gray-900 mb-2">
                                        Select files to upload
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Or drag and drop video files
                                    </p>
                                    <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition">
                                        SELECT FILES
                                    </div>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoSelect}
                                        className="hidden"
                                    />
                                </div>
                            </label>

                            {errors.video && (
                                <div className="mt-4 text-red-600 flex items-center justify-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{errors.video}</span>
                                </div>
                            )}

                            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">
                                    By submitting your videos to YouTube, you acknowledge that you agree to YouTube's Terms of Service and Community Guidelines.
                                </p>
                                <p className="text-sm text-gray-600">
                                    Please be sure not to violate others' copyright or privacy rights.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="shrink-0 w-32 h-20 bg-gray-200 rounded flex items-center justify-center">
                                    <Video className="w-8 h-8 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-1">{videoFile?.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {(videoFile?.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Uploading...</span>
                                    <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>

                            {uploadProgress === 100 && (
                                <div className="text-center text-green-600 flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Upload complete! Processing video...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Upload