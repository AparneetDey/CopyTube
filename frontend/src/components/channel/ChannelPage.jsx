import React, { useState } from 'react';
import { Video, Users} from 'lucide-react';
import ChannelHeader from './sections/ChannelHeader';
import TabNavigation from './sections/TabNavigation';
import TweetsTab from './sections/TweetsTab';
import HomeTab from './sections/HomeTab';
import VideosTab from './sections/VideosTab';

// Main Channel Page Component
export default function ChannelPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [channelData, setChannelData] = useState({
    name: 'Tech Tutorials',
    handle: 'techtutorials',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=300&fit=crop',
    subscribers: '1.2M',
    videoCount: 245,
    verified: true,
    description: 'Learn coding, web development, and tech tutorials. New videos every week! 🚀',
    fullDescription: 'Welcome to Tech Tutorials! We create high-quality programming tutorials, web development guides, and technology reviews.\n\nOn this channel you will find:\n• JavaScript & React tutorials\n• Python programming guides\n• Web development projects\n• Tech product reviews\n\nNew videos every Tuesday and Friday!',
    email: 'contact@techtutorials.com',
    location: 'San Francisco, CA',
    joinedDate: 'Jan 15, 2020',
    totalViews: '45.8M'
  });

  const handleAvatarChange = (newAvatar) => {
    setChannelData(prev => ({ ...prev, avatar: newAvatar }));
  };

  const handleBannerChange = (newBanner) => {
    setChannelData(prev => ({ ...prev, banner: newBanner }));
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

  const tweets = [
    {
      name: 'Tech Tutorials',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      time: '2h ago',
      text: 'Just dropped a new React tutorial! 🔥 Learn hooks, context, and custom hooks in one video. Link in bio!',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
      likes: 1245,
      replies: 89
    },
    {
      name: 'Tech Tutorials',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      time: '1d ago',
      text: 'What topic should I cover next? 🤔\n\n1. Advanced TypeScript\n2. Next.js 14\n3. Docker for Beginners\n4. System Design\n\nVote below! 👇',
      likes: 2341,
      replies: 234
    },
    {
      name: 'Tech Tutorials',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      time: '3d ago',
      text: 'Pro tip: Always write clean, readable code. Your future self will thank you! 💻✨',
      likes: 892,
      replies: 45
    },
    {
      name: 'Tech Tutorials',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      time: '5d ago',
      text: 'Celebrating 1.2M subscribers! 🎉 Thank you all for the amazing support. Here\'s to many more tutorials together! ❤️',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
      likes: 5678,
      replies: 567
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ChannelHeader 
        channel={channelData} 
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
        {activeTab === 'tweets' && <TweetsTab tweets={tweets} />}
      </div>
    </div>
  );
}