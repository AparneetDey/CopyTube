import React from 'react'

const TabNavigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
      { id: 'home', label: 'Home' },
      { id: 'videos', label: 'Videos' },
      { id: 'shorts', label: 'Shorts' },
      { id: 'playlists', label: 'Playlists' },
      { id: 'community', label: 'Community' },
      { id: 'tweets', label: 'Tweets' },
    ];
  
    return (
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-2 text-sm sm:text-base font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

export default TabNavigation