import { useCallback, useEffect, useState } from "react";
import RecommendedCard from "./RecommendedCard";
import api from "../../../../services/apiService";

export default function RecommendedVideos({v}) {
  const [recommendedVideos, setRecommendedVideos] = useState([])

  const fetchRecommendedVideos = useCallback(async () => {
    // console.log(v);
    try {
      const res = await api.get(`/videos/` , {
        params: {
          limit: 5,
          sortBy: "views",
          sortType: "desc",
          userId: v?.owner?._id
        }
      });

      const filteredVideos = res.data.data.videos.filter(video => video._id !== v?._id);

      setRecommendedVideos(filteredVideos);
    } catch (error) {
      console.log("Error fetching recommended videos ::", error);
    }
  }, []);

  useEffect(() => {
    fetchRecommendedVideos();
  }, [fetchRecommendedVideos, v])
  

  return (
    <div className="space-y-3 max-h-screen overflow-y-auto">
      {recommendedVideos.map((video) => (
        <RecommendedCard key={video._id} video={video} />
      ))}
    </div>
  )
}
