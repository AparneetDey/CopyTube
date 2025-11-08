import React, { useCallback, useEffect, useState } from 'react'
import VideoCard from "./VideoCard"
import { Play } from 'lucide-react';
import api from '../../../../services/apiService';
import LoadingSpinner from "../../../loading/LoadingSpinner"
import PopularVideoCard from './PopularVideoCard';
import { formatDate, formatDuration, formatValue } from "../../../functions"
import { Link } from 'react-router-dom';
import MainPopularCard from './MainPopularCard';

const HomeTab = ({ channel }) => {
  const [popularVideos, setPopularVideos] = useState(null);
  const [recentVideos, setRecentVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popularErrorMessage, setPopularErrorMessage] = useState("");
  const [recentErrorMessage, setRecentErrorMessage] = useState("");

  const fetchPopularVideos = useCallback(async (id) => {
    setLoading(true);
    setPopularErrorMessage("");

    try {
      const res = await api.get("/dashboard/videos/", {
        params: {
          sortBy: "views",
          sortType: "desc",
          limit: 4,
          userId: id
        }
      });

      setPopularVideos(res.data.data.videos);
    } catch (error) {
      console.log("Something went wrong while fetching ::", error)
      setPopularErrorMessage("No Popular Videos Available");
    } finally {
      setLoading(false)
    }
  }, []);

  const fetchRecentVideos = useCallback( async (id) => {
    setLoading(true);
    setRecentErrorMessage("");

    try {
      const res = await api.get("/dashboard/videos/", {
        params: {
          sortBy: "createdAt",
          sortType: "desc",
          userId: id,
          limit: 8
        }
      });

      setRecentVideos(res.data.data.videos);
    } catch (error) {
      console.log("Something went wrong while fetching ::", error)
      setRecentErrorMessage("No Recent Videos Available");
    } finally {
      setLoading(false)
    }
  },[])
  

  useEffect(() => {
    fetchPopularVideos(channel?._id);
    fetchRecentVideos(channel?._id)
  }, [channel])


  if (loading) return <LoadingSpinner />


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Popular Video</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MainPopularCard video={popularVideos ? popularVideos[0] : {}} />

        <div className="space-y-4">
          {popularVideos?.slice(1, 4).map((video) => (
            <PopularVideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>

      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Uploads</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recentVideos?.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default HomeTab