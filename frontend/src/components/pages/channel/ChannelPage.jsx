import React, { useCallback, useEffect, useState } from 'react';
import { Video, Users} from 'lucide-react';
import ChannelHeader from './sections/ChannelHeader';
import TabNavigation from './sections/TabNavigation';
import TweetsTab from './sections/TweetsTab';
import HomeTab from './sections/HomeTab';
import VideosTab from './sections/VideosTab';
import { useParams } from "react-router-dom";
import api from '../../../services/apiService';

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

      console.log(res.data.data.channel);
      setChannel(res.data.data.channel);
    } catch (error) {
      console.log("Something went wrong while fetching channel ::",error);
      setErrorMessage("No channel available!");
    }
  }, []);

  const fetchStats = useCallback(async (id) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await api.get(`/dashboard/${id}`);

      console.log(res.data.data);
      setStats(res.data.data);
    } catch (error) {
      console.log("Something went wrong while fetching channel ::",error);
      setErrorMessage("No channel available!");
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

  const videos = [
    {
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      title: 'Complete React Tutorial for Beginners 2024',
      duration: '2:15:30',
      views: '850K',
      uploadedAt: '2 weeks ago'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
      title: 'JavaScript ES6 Features You Must Know',
      duration: '18:45',
      views: '420K',
      uploadedAt: '1 month ago'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      title: 'Build a Full Stack App with Node.js',
      duration: '45:20',
      views: '1.2M',
      uploadedAt: '3 weeks ago'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
      title: 'CSS Grid vs Flexbox - Complete Guide',
      duration: '25:10',
      views: '680K',
      uploadedAt: '1 week ago'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
      title: 'TypeScript Crash Course 2024',
      duration: '1:05:45',
      views: '920K',
      uploadedAt: '4 days ago'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
      title: 'Python for Data Science Tutorial',
      duration: '38:15',
      views: '560K',
      uploadedAt: '2 weeks ago'
    }
  ];

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
        {activeTab === 'home' && <HomeTab videos={videos} />}
        {activeTab === 'videos' && <VideosTab videos={videos} />}
        {activeTab === 'shorts' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-gray-600">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No shorts available yet</p>
          </div>
        )}
        {activeTab === 'playlists' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-gray-600">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No playlists created yet</p>
          </div>
        )}
        {activeTab === 'community' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-gray-600">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>No community posts yet</p>
          </div>
        )}
        {activeTab === 'tweets' && <TweetsTab channel={channel} />}
      </div>
    </div>
  );
}