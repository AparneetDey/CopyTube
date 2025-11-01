import React, { useState } from 'react';
import Upload from "./Step/Upload"
import Details from './Step/Details';
import Success from './Step/Success';

export default function UploadPage() {
    const [step, setStep] = useState('upload'); // 'upload', 'details', 'success'
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);

    const [videoDetails, setVideoDetails] = useState({
        title: '',
        description: '',
        visibility: 'public',
        category: '',
        tags: '',
        thumbnail: null,
    });

    const [errors, setErrors] = useState({});

    const simulateUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);

                    // Delay the parent update slightly
                    setTimeout(() => setStep('details'), 0);

                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    // Upload Step
    if (step === 'upload') {
        return (<Upload 
            videoFile={videoFile} 
            setVideoFile={setVideoFile} 
            errors={errors} 
            setErrors={setErrors} 
            setStep={setStep} 
        />);
    }

    // Details Step
    if (step === 'details') {
        return (
            <Details 
            videoDetails={videoDetails} 
            videoFile={videoFile}
            setVideoDetails={setVideoDetails}
            errors={errors} 
            setErrors={setErrors}
            thumbnailFile={thumbnailFile}
            setThumbnailFile={setThumbnailFile}
            setStep={setStep}
        />
        );
    }

    // Success Step
    if (step === 'success') {
        return (
            <Success
                videoDetails={videoDetails}
                setVideoDetails={setVideoDetails}
                setVideoFile={setVideoFile}
                setThumbnailFile={setThumbnailFile}
                setStep={setStep}
            />
        );
    }
}