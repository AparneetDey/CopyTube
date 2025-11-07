import { Search } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import VideoCard from './VideoCard';
import api from '../../../../services/apiService';
import LoadingSpinner from '../../../loading/LoadingSpinner';

const VideosTab = ({id}) => {
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

  const fetchVideos = useCallback(async (id, newPage = 1) => {
    if(loading) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await api.get("/dashboard/videos/", {
        params: {
          sortBy: "createdAt",
          sortType: "desc",
          userId: id,
        }
      });

      const newVideos = res.data.data.videos || [];
			setVideos(prev => newPage === 1 ? newVideos : [...prev, ...newVideos]);

			// ✅ Check actual length instead of just backend flag
			if (newVideos.length < 12) {
				setHasMore(false);
			} else {
				setHasMore(true);
			}
    } catch (error) {
      console.log("Something went wrong while fetching ::", error)
      setErrorMessage("No Videos Available");
    } finally {
      setLoading(false)
    }
  }, [])

	//Handle scroll updation
	useEffect(() => {
		const handleScroll = () => {
			const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
			if (bottom && hasMore && !loading) {
				setPage(prev => prev + 1);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [hasMore, loading]);



	useEffect(() => {
		fetchVideos(id, page);
	}, [page, id, fetchVideos]);
  
  if(loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Uploads</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos?.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default VideosTab