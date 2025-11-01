import { useCallback, useEffect, useState } from "react";
import CommentsSection from "./Video/CommentsSection";
import RecommendedVideos from "./Video/RecommendedVideos";
import VideoInfo from "./Video/VideoInfo";
import VideoPlayer from "./Video/VideoPlayer";
import { useParams } from "react-router-dom";
import api from "../../../services/apiService";
import LoadingSpinner from "../../loading/LoadingSpinner";

const VideoPage = () => {
    const { videoId } = useParams();
    const [video, setVideo] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const fetchVideo = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const res = await api.get(`/videos/v/${videoId}`);
            setVideo(res.data.data);
        } catch (error) {
            console.log(error);
            setErrorMessage("No video is Available");
        } finally {
            setLoading(false);
        }
    }, [videoId])

    useEffect(() => {
        fetchVideo();
    }, [fetchVideo, videoId])

    if (loading) return <LoadingSpinner />

    return (
        <main className="pt-4 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {/* Video Player Section */}
                <div className="lg:col-span-3">
                    <VideoPlayer video={video} />
                    <VideoInfo video={video} />
                    <CommentsSection video={video} />
                </div>

                {/* Recommended Videos Sidebar */}
                <div className="lg:col-span-1">
                    <RecommendedVideos v={video} />
                </div>
            </div>
        </main>
    )
}


export default VideoPage;