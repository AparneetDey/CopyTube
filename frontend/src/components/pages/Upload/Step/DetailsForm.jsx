import { Image, X } from 'lucide-react';
import React from 'react'

// Details Form Component
const DetailsForm = ({ videoDetails, setVideoDetails, errors, thumbnailFile, onThumbnailSelect, onRemoveThumbnail }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVideoDetails(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={videoDetails.title}
                    onChange={handleInputChange}
                    placeholder="Add a title that describes your video"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base`}
                    maxLength={100}
                />
                <div className="flex items-center justify-between mt-2">
                    {errors.title && (
                        <p className="text-red-500 text-xs sm:text-sm">{errors.title}</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 ml-auto">
                        {videoDetails.title.length}/100
                    </p>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    name="description"
                    value={videoDetails.description}
                    onChange={handleInputChange}
                    placeholder="Tell viewers about your video"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm sm:text-base`}
                    rows="4"
                    maxLength={5000}
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    {videoDetails.description.length}/5000
                </p>
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    Select or upload a picture that shows what's in your video
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {thumbnailFile ? (
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-500">
                            <img
                                src={thumbnailFile}
                                alt="Thumbnail"
                                className="w-full h-full object-contain"
                            />
                            <button
                                onClick={onRemoveThumbnail}
                                className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1"
                            >
                                <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </button>
                        </div>
                    ) : (
                        <label className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-300">
                            <Image className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
                            <span className="text-xs sm:text-sm text-gray-600">Upload (Required)</span>
                            <input
                                type="file"
                                accept="image/*"
                                required
                                onChange={onThumbnailSelect}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Validation message */}
                {errors.thumbnailFile && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2">
                        Please upload a thumbnail before proceeding.
                    </p>
                )}
            </div>

        </div>
    );
}

export default DetailsForm