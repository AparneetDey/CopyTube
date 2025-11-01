import { Eye, Globe, Image, Lock, Video, X } from 'lucide-react';
import React from 'react';

const Details = ({ videoDetails, setVideoDetails, videoFile, errors, setErrors, thumbnailFile, setThumbnailFile, setStep }) => {

    // Handle thumbnail selection
    const handleThumbnailSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors({ thumbnail: 'Please select a valid image file' });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailFile(reader.result);
                setVideoDetails({ ...videoDetails, thumbnail: reader.result });
            };
            reader.readAsDataURL(file);

            setErrors({ ...errors, thumbnail: '' });
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVideoDetails({ ...videoDetails, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // Validate details form
    const validateDetails = () => {
        const newErrors = {};

        if (!videoDetails.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (videoDetails.title.length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }

        if (videoDetails.description.length > 5000) {
            newErrors.description = 'Description must be less than 5000 characters';
        }

        if (!videoDetails.category) {
            newErrors.category = 'Please select a category';
        }

        return newErrors;
    };

    // Handle publish
    const handlePublish = () => {
        const newErrors = validateDetails();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Simulate publishing
        console.log('Publishing video:', { videoFile, ...videoDetails });
        setStep('success');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Video details</h1>
                    <button className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Title */}
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title (required)
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={videoDetails.title}
                                onChange={handleInputChange}
                                placeholder="Add a title that describes your video"
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                                    errors.title ? 'border-red-500' : 'border-gray-300'
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
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
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
                                Thumbnail
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
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => setThumbnailFile(null)}
                                            className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1"
                                        >
                                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-300">
                                        <Image className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
                                        <span className="text-xs sm:text-sm text-gray-600">Upload</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailSelect}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category (required)
                            </label>
                            <select
                                name="category"
                                value={videoDetails.category}
                                onChange={handleInputChange}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                                    errors.category ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base`}
                            >
                                <option value="">Select a category</option>
                                <option value="education">Education</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="gaming">Gaming</option>
                                <option value="music">Music</option>
                                <option value="news">News & Politics</option>
                                <option value="science">Science & Technology</option>
                                <option value="sports">Sports</option>
                                <option value="vlog">People & Blogs</option>
                            </select>
                            {errors.category && (
                                <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.category}</p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={videoDetails.tags}
                                onChange={handleInputChange}
                                placeholder="Enter tags separated by commas"
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                            />
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                Tags can help people find your video
                            </p>
                        </div>

                        {/* Mobile Visibility Section */}
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:hidden">
                            <h3 className="font-medium text-gray-900 mb-4">Visibility</h3>

                            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-2">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={videoDetails.visibility === 'public'}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium text-gray-900 text-sm">Public</span>
                                    </div>
                                    <p className="text-xs text-gray-600">
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
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Eye className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium text-gray-900 text-sm">Unlisted</span>
                                    </div>
                                    <p className="text-xs text-gray-600">
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
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Lock className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium text-gray-900 text-sm">Private</span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Only you can watch your video
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Sidebar - Hidden on mobile, shown on desktop */}
                    <div className="hidden lg:block space-y-6">
                        {/* Video Preview */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-medium text-gray-900 mb-4">Video preview</h3>
                            <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                                {thumbnailFile ? (
                                    <img
                                        src={thumbnailFile}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
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

                        {/* Desktop Visibility */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-medium text-gray-900 mb-4">Visibility</h3>

                            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-2">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="public"
                                    checked={videoDetails.visibility === 'public'}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium text-gray-900">Public</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
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
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Eye className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium text-gray-900">Unlisted</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
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
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Lock className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium text-gray-900">Private</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Only you can watch your video
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions - Fixed on mobile */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 shadow-lg">
                    <div className="max-w-7xl mx-auto flex items-center justify-end gap-2 sm:gap-4">
                        <button className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition">
                            Save as draft
                        </button>
                        <button
                            onClick={handlePublish}
                            className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;