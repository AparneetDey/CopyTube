import React, { useCallback, useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import PlaylistHeader from './components/PlaylistHeader';
import PlaylistVideoItem from './components/PlaylistVideoItem';
import LoadingSpinner from "../../loading/LoadingSpinner"
import api from "../../../services/apiService.js";
import { useNavigate, useParams } from 'react-router-dom';

// Main Playlist Page Component
export default function PlaylistPage() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [playlist, setPlaylist] = useState({});
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaylist = useCallback( async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/playlists/p/${id}`);

      console.log(res.data.data);

      setPlaylist(res.data.data[0]);
      setVideos(res.data.data[0].videos);
    } catch (error) {
      console.log("Error Fetching Playlist ::", error);
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlaylist(playlistId);
  }, [playlistId, fetchPlaylist])
  

  const handlePlayFirst = () => {
    if(videos.length > 0) navigate(`/watch/${videos[0]._id}`)
  };

  const handleRandom = () => {
    if (videos.length === 0) return;
    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];
    setCurrentPlayingId(randomVideo._id);
    navigate(`/watch/${randomVideo._id}`);
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      const res = await api.patch(`/playlists/p/remove/${playlistId}/${videoId}`)

      fetchPlaylist(playlistId);
    } catch (error) {
      console.log("Error Removing Video ::", error);
    }
  };

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      <PlaylistHeader 
        playlist={playlist}
        onPlayFirst={handlePlayFirst}
        onRandom={handleRandom}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Playlist Controls */}
          <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
                {videos.length} video{videos.length !== 1 ? 's' : ''}
              </h2>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Sort by
            </button>
          </div>

          {/* Video List */}
          <div className="divide-y divide-gray-100">
            {videos.map((video, index) => (
              <PlaylistVideoItem
                key={video._id}
                video={video}
                index={index + 1}
                isPlaying={currentPlayingId === video._id}
                onRemove={handleRemoveVideo}
              />
            ))}
          </div>

          {videos.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No videos in this playlist</p>
              <p className="text-sm">Add videos to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}