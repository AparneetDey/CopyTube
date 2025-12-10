import React, { useState } from 'react';
import { Play, Share2, MoreVertical, Shuffle, Download, Plus, Lock, Globe, Eye, Check, Clock } from 'lucide-react';
import PlaylistHeader from './components/PlaylistHeader';
import PlaylistVideoItem from './components/PlaylistVideoItem';

// Main Playlist Page Component
export default function PlaylistPage() {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [videos, setVideos] = useState([
    {
      id: 1,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      title: 'React Hooks Complete Tutorial - useState, useEffect, useContext & Custom Hooks',
      channel: 'Tech Tutorials',
      duration: '45:32',
      views: '1.2M',
      uploadedAt: '2 weeks ago'
    },
    {
      id: 2,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
      title: 'JavaScript ES6+ Features Every Developer Should Know in 2024',
      channel: 'Tech Tutorials',
      duration: '32:18',
      views: '850K',
      uploadedAt: '3 weeks ago'
    },
    {
      id: 3,
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      title: 'Build a Full Stack MERN App - Complete Project Tutorial',
      channel: 'Tech Tutorials',
      duration: '2:15:45',
      views: '2.1M',
      uploadedAt: '1 month ago'
    },
    {
      id: 4,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
      title: 'CSS Grid & Flexbox Mastery - Complete Responsive Layout Guide',
      channel: 'Tech Tutorials',
      duration: '28:55',
      views: '670K',
      uploadedAt: '1 week ago'
    },
    {
      id: 5,
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
      title: 'TypeScript for Beginners - Complete Course 2024',
      channel: 'Tech Tutorials',
      duration: '1:05:22',
      views: '920K',
      uploadedAt: '5 days ago'
    },
    {
      id: 6,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
      title: 'Python Data Science Tutorial - NumPy, Pandas & Matplotlib',
      channel: 'Tech Tutorials',
      duration: '52:10',
      views: '780K',
      uploadedAt: '2 weeks ago'
    },
    {
      id: 7,
      thumbnail: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=400&h=250&fit=crop',
      title: 'Node.js & Express.js REST API Development - Full Course',
      channel: 'Tech Tutorials',
      duration: '1:35:40',
      views: '1.5M',
      uploadedAt: '3 weeks ago'
    },
    {
      id: 8,
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop',
      title: 'MongoDB Complete Tutorial - Database Design & Operations',
      channel: 'Tech Tutorials',
      duration: '42:25',
      views: '650K',
      uploadedAt: '1 week ago'
    }
  ]);

  const playlist = {
    name: 'React Tutorial Series',
    description: 'Complete React tutorial series covering hooks, context, routing, state management, and real-world projects. Perfect for beginners and intermediate developers.',
    privacy: 'public',
    videoCount: videos.length,
    totalViews: '8.7M',
    updatedAt: '2 days ago',
    owner: {
      name: 'Tech Tutorials',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    },
    videos: videos
  };

  const handlePlayAll = () => {
    setCurrentPlayingId(videos[0]?.id);
    console.log('Playing all videos');
  };

  const handleShuffle = () => {
    const shuffled = [...videos].sort(() => Math.random() - 0.5);
    setVideos(shuffled);
    setCurrentPlayingId(shuffled[0]?.id);
    console.log('Shuffling playlist');
  };

  const handlePlayVideo = (videoId) => {
    setCurrentPlayingId(videoId);
    console.log('Playing video:', videoId);
  };

  const handleRemoveVideo = (videoId) => {
    setVideos(videos.filter(v => v.id !== videoId));
    if (currentPlayingId === videoId) {
      setCurrentPlayingId(null);
    }
    console.log('Removed video:', videoId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlaylistHeader 
        playlist={playlist}
        onPlayAll={handlePlayAll}
        onShuffle={handleShuffle}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                key={video.id}
                video={video}
                index={index + 1}
                isPlaying={currentPlayingId === video.id}
                onPlay={handlePlayVideo}
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