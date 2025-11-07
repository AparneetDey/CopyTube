import React, { useCallback, useEffect, useState } from 'react';
import { Video, Users} from 'lucide-react';
import ChannelHeader from './sections/ChannelHeader';
import TabNavigation from './sections/TabNavigation';
import TweetsTab from './sections/TweetsTab';
import HomeTab from './sections/HomeTab';
import VideosTab from './sections/VideosTab';
import { useParams } from "react-router-dom";
import api from '../../../services/apiService';
import LoadingSpinner from '../../loading/LoadingSpinner';

// Main Channel Page Component
export default function ChannelPage() {
  const {username} = useParams();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [channel, setChannel] = useState({});
  const [stats, setStats] = useState({});

  const fetchChannel = useCallback(async (username) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await api.get(`/users/c/${username}`);
      setChannel(res.data.data.channel);
    } catch (error) {
      console.log("Something went wrong while fetching channel ::",error);
      setErrorMessage("No channel available!");
    } finally {
      setLoading(false)
    }
  }, []);

  const fetchStats = useCallback(async (id) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await api.get(`/dashboard/channel/${id}`);
      setStats(res.data.data);
    } catch (error) {
      console.log("Something went wrong while fetching channel ::",error);
      setErrorMessage("No channel available!");
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchChannel(username);
  }, [username])

  useEffect(() => {
    if(Object.keys(channel).length>0) fetchStats(channel._id);
  }, [channel])

  const handleAvatarChange = (newAvatar) => {
    setChannel(prev => ({ ...prev, avatar: newAvatar }));
  };

  const handleBannerChange = (newBanner) => {
    setChannel(prev => ({ ...prev, banner: newBanner }));
  };

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      <ChannelHeader 
        channel={channel} 
        stats={stats}
        onAvatarChange={handleAvatarChange}
        onBannerChange={handleBannerChange}
      />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="pb-8">
        {activeTab === 'home' && <HomeTab channel={channel} />}
        {activeTab === 'videos' && <VideosTab channel={channel} />}
        {activeTab === 'playlists' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-gray-600">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No playlists created yet</p>
          </div>
        )}
        {activeTab === 'tweets' && <TweetsTab channel={channel} />}
      </div>
    </div>
  );
}