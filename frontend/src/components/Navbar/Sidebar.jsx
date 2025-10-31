import React from 'react';
import { Home, TrendingUp, Library, History, Clock, ThumbsUp, Settings, Flag, HelpCircle, SubscriptIcon, Twitter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user, isAuthenticated } = useAuth();

  const mainItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Twitter, label: 'Tweet', path: '/tweet' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: SubscriptIcon, label: 'Subscriptions', path: '/subscriptions' },
  ];

  const libraryItems = [
    { icon: Library, label: 'Library', path: '/library' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Clock, label: 'Watch Later', path: '/watch-later' },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/liked' },
  ];

  const settingsItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Flag, label: 'Report History', path: '/reports' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#0000004f] z-40" />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-16">
          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            {/* Main Section */}
            <div className="px-4 mb-2">
              {mainItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <Icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Library Section */}
            {isAuthenticated && (
              <div className="px-4 mb-2">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
                  Library
                </p>
                {libraryItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <Icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Divider */}
            {isAuthenticated && <div className="border-t border-gray-200 my-2"></div>}

            {/* Settings Section */}
            <div className="px-4 mb-2">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <Icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* User Info at Bottom */}
          {isAuthenticated && user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

