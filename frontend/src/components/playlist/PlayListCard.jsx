import { List } from 'lucide-react'
import React from 'react'

const PlayListCard = ({playlist, toggleVideoInPlaylist}) => {
    return (
        <label
            key={playlist._id}
            className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50 transition cursor-pointer"
        >
            {/* Checkbox */}
            <div className="relative shrink-0">
                <input
                    type="checkbox"
                    checked={!!playlist.isVideoSaved}
                    onChange={() => toggleVideoInPlaylist(playlist._id)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0 active:ring-0"
                />
            </div>

            {/* Playlist Icon */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center shrink-0">
                <List className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>

            {/* Playlist Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                    {playlist.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-600">
                        {playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>
        </label>
    )
}

export default PlayListCard