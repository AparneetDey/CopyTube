import React, { useState } from 'react';
import { X } from 'lucide-react';
import UploadStep from './Step/UploadStep';
import SuccessScreen from './Step/SuccessScreen';
import PublishingProgress from './Step/PublishingProgress';
import VisibilitySettings from './Step/VisibilitySettings';
import VideoPreview from './Step/VideoPreview';
import DetailsForm from './Step/DetailsForm';
import api from "../../../services/apiService";



// Main App Component
const UploadPage = () => {
    const [step, setStep] = useState('upload'); // 'upload', 'details', 'publishing', 'success'
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [publishProgress, setPublishProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isPublished, setIsPublished] = useState(true);
    const [error, setError] = useState('');

    const [videoDetails, setVideoDetails] = useState({
        title: '',
        description: '',
    });

    const [errors, setErrors] = useState({});

    const handleVideoSelect = (file) => {
        if (!file.type.startsWith('video/')) {
            setError('Please select a valid video file');
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            setError('Video file must be less than 100MB');
            return;
        }

        setVideoFile(file);
        setError('');
        setIsUploading(true);

        // Simulate upload
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setTimeout(() => setStep('details'), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const handleThumbnailSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnail(file); // Save actual File object
            setThumbnailFile(URL.createObjectURL(file)); // For preview only
        }
    };

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

        if (!thumbnail) {
            newErrors.thumbnailFile = "Please upload a thumbnail before proceeding.";
        }

        return newErrors;
    };

    const handlePublish = async () => {
        const newErrors = validateDetails();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setStep("publishing");
        setPublishProgress(0);

        // Create form data (important for file uploads)
        const formData = new FormData();
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);
        formData.append("title", videoDetails.title);
        formData.append("description", videoDetails.description);
        formData.append("isPublished", isPublished);

        try {
            const totalSize = videoFile.size;
            let uploaded = 0;

            // manual progress logic
            const interval = setInterval(() => {
                if (uploaded < totalSize * 0.99) {
                    // simulate upload chunks
                    uploaded += totalSize * 0.03; // increase 1% per interval
                    const percent = Math.min((uploaded / totalSize) * 100, 99);
                    setPublishProgress(Math.floor(percent));
                }
            }, 4000);

            await api.post("/videos/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            clearInterval(interval);
            setPublishProgress(100);
            setTimeout(() => setStep("success"), 500);
        } catch (error) {
            console.error("Something went wrong while uploading video:", error);
        }
    };


    const handleUploadAnother = () => {
        setStep('upload');
        setVideoFile(null);
        setIsPublished(true);
        setThumbnailFile(null);
        setUploadProgress(0);
        setPublishProgress(0);
        setVideoDetails({
            title: '',
            description: '',
        });
        setErrors({});
        setError('');
    };

    if (step === 'upload') {
        return (
            <UploadStep
                onVideoSelect={handleVideoSelect}
                videoFile={videoFile}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                error={error}
            />
        );
    }

    if (step === 'details') {
        return (
            <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
                <div className="max-w-7xl mx-auto p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Video details</h1>
                        <button className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className=" lg:col-span-2">
                            <DetailsForm
                                videoDetails={videoDetails}
                                setVideoDetails={setVideoDetails}
                                errors={errors}
                                thumbnailFile={thumbnailFile}
                                onThumbnailSelect={handleThumbnailSelect}
                                onRemoveThumbnail={() => setThumbnailFile(null)}
                            />
                            <VisibilitySettings
                                isMobile={true}
                                isPublished={isPublished}
                                setIsPublished={setIsPublished}
                            />
                        </div>

                        <div>
                            <VideoPreview
                                videoFile={videoFile}
                                thumbnailFile={thumbnailFile}
                                videoDetails={videoDetails}
                            />
                            <VisibilitySettings
                                isMobile={false}
                                isPublished={isPublished}
                                setIsPublished={setIsPublished}
                            />
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 shadow-lg">
                        <div className="max-w-7xl mx-auto flex items-center justify-end gap-2 sm:gap-4">
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
    }

    if (step === 'publishing') {
        return (
            <PublishingProgress
                progress={publishProgress}
                videoDetails={videoDetails}
            />
        );
    }

    if (step === 'success') {
        return (
            <SuccessScreen
                videoDetails={videoDetails}
                onUploadAnother={handleUploadAnother}
                isPublished={isPublished}
            />
        );
    }
}

export default UploadPage