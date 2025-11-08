import React, { useState } from 'react';
import { X, Plus, Check, Lock, Globe, List, Search } from 'lucide-react';
import { usePlayList } from '../context/PlayListContext';

function SaveToPlaylistModal() {
	const {isOpen, handleClosePlayList, videoData} = usePlayList();

	const [playlists, setPlaylists] = useState([
		{
			id: 1,
			name: 'Watch Later',
			videoCount: 12,
			privacy: 'private',
			isVideoSaved: false
		},
		{
			id: 2,
			name: 'Favorites',
			videoCount: 45,
			privacy: 'private',
			isVideoSaved: true
		},
		{
			id: 3,
			name: 'React Tutorials',
			videoCount: 23,
			privacy: 'public',
			isVideoSaved: false
		},
		{
			id: 4,
			name: 'JavaScript Learning',
			videoCount: 34,
			privacy: 'unlisted',
			isVideoSaved: false
		},
		{
			id: 5,
			name: 'Web Development',
			videoCount: 67,
			privacy: 'public',
			isVideoSaved: true
		}
	]);

	const [searchQuery, setSearchQuery] = useState('');
	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [newPlaylistName, setNewPlaylistName] = useState('');
	const [newPlaylistPrivacy, setNewPlaylistPrivacy] = useState('private');

	const toggleVideoInPlaylist = (playlistId) => {
		setPlaylists(prevPlaylists =>
			prevPlaylists.map(playlist =>
				playlist.id === playlistId
					? {
						...playlist,
						isVideoSaved: !playlist.isVideoSaved,
						videoCount: playlist.isVideoSaved
							? playlist.videoCount - 1
							: playlist.videoCount + 1
					}
					: playlist
			)
		);
	};

	const handleCreatePlaylist = () => {
		if (newPlaylistName.trim()) {
			const newPlaylist = {
				id: playlists.length + 1,
				name: newPlaylistName,
				videoCount: 1,
				privacy: newPlaylistPrivacy,
				isVideoSaved: true
			};
			setPlaylists([newPlaylist, ...playlists]);
			setNewPlaylistName('');
			setIsCreatingNew(false);
		}
	};

	const filteredPlaylists = playlists.filter(playlist =>
		playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-500 flex items-start justify-center pt-16 sm:pt-20 px-4">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black opacity-50 transition-opacity"
				onClick={() => handleClosePlayList()}
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-slide-down">
				{/* Header */}
				<div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-900">Save video to...</h2>
					<button
						onClick={() => handleClosePlayList()}
						className="p-1 hover:bg-gray-100 rounded-full transition"
					>
						<X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
					</button>
				</div>

				{/* Video Title */}
				<div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-200">
					<p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
						{videoData.title || 'Untitled Video'}
					</p>
				</div>

				{/* Search */}
				<div className="p-3 sm:p-4 border-b border-gray-200">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search playlists"
							className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
						/>
					</div>
				</div>

				{/* Playlist List */}
				<div className="flex-1 overflow-y-auto">
					{/* Create New Playlist */}
					{!isCreatingNew ? (
						<button
							onClick={() => setIsCreatingNew(true)}
							className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50 transition text-left"
						>
							<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center shrink-0">
								<Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
							</div>
							<span className="text-sm sm:text-base font-medium text-gray-900">Create new playlist</span>
						</button>
					) : (
						<div className="px-4 sm:px-5 py-3 border-b border-gray-200 bg-gray-50">
							<input
								type="text"
								value={newPlaylistName}
								onChange={(e) => setNewPlaylistName(e.target.value)}
								placeholder="Enter playlist name"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-2 text-sm sm:text-base"
								autoFocus
							/>
							<div className="flex items-center gap-2 mb-3">
								<select
									value={newPlaylistPrivacy}
									onChange={(e) => setNewPlaylistPrivacy(e.target.value)}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
								>
									<option value="private">Private</option>
									<option value="unlisted">Unlisted</option>
									<option value="public">Public</option>
								</select>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={handleCreatePlaylist}
									disabled={!newPlaylistName.trim()}
									className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition text-sm"
								>
									Create
								</button>
								<button
									onClick={() => {
										setIsCreatingNew(false);
										setNewPlaylistName('');
									}}
									className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition text-sm"
								>
									Cancel
								</button>
							</div>
						</div>
					)}

					{/* Existing Playlists */}
					<div className="divide-y divide-gray-100">
						{filteredPlaylists.length > 0 ? (
							filteredPlaylists.map((playlist) => (
								<label
									key={playlist.id}
									className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50 transition cursor-pointer"
								>
									{/* Checkbox */}
									<div className="relative shrink-0">
										<input
											type="checkbox"
											checked={playlist.isVideoSaved}
											onChange={() => toggleVideoInPlaylist(playlist.id)}
											className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
										/>
										{playlist.isVideoSaved && (
											<Check className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" />
										)}
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
											<span className="text-gray-400">•</span>
											<div className="flex items-center gap-1">
												{playlist.privacy === 'private' && (
													<Lock className="w-3 h-3 text-gray-500" />
												)}
												{playlist.privacy === 'public' && (
													<Globe className="w-3 h-3 text-gray-500" />
												)}
												<span className="text-xs text-gray-600 capitalize">
													{playlist.privacy}
												</span>
											</div>
										</div>
									</div>
								</label>
							))
						) : (
							<div className="px-4 sm:px-5 py-8 text-center text-gray-500 text-sm">
								No playlists found
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
					<button
						onClick={() => handleClosePlayList()}
						className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm sm:text-base"
					>
						Done
					</button>
				</div>
			</div>

			<style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
		</div>
	);
}

export default SaveToPlaylistModal;