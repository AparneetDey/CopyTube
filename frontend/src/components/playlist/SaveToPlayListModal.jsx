import React, { useCallback, useEffect, useState } from 'react';
import { X, Plus, Check, Lock, Globe, List, Search } from 'lucide-react';
import { usePlayList } from '../context/PlayListContext';
import { useAuth } from "../context/AuthContext";
import api from '../../services/apiService';
import PlayListCard from './PlayListCard';

function SaveToPlaylistModal() {
	const { user } = useAuth();
	const { isOpen, handleClosePlayList, videoData } = usePlayList();

	const [playlists, setPlaylists] = useState([]);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState('');
	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [newPlaylistName, setNewPlaylistName] = useState('');
	const [newPlaylistDescription, setNewPlaylistDescription] = useState("");

	const fetchPlayLists = useCallback(async (id) => {
		setLoading(true);
		setErrorMessage("");
		try {
			const res = await api.get(`/playlists/p/user/${id}`)

			setPlaylists(res.data?.data);
		} catch (error) {
			console.log("Something went wrong while fetching playlists ::", error);
			setErrorMessage("No Play List Available");
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		if (user) fetchPlayLists(user._id)
	}, [user, fetchPlayLists])

	useEffect(() => {
		if (!videoData?.id) return;
	
		setPlaylists((prevPlaylists) =>
			prevPlaylists.map((playlist) => ({
				...playlist,
				isVideoSaved: playlist.videos.includes(videoData.id),
			}))
		);
	}, [videoData]);

	const handleSavePlayList = async () => {
		try {
			// Use Promise.all to handle async requests properly
			await Promise.all(
				playlists.map(async (playlist) => {
					if (playlist.isVideoSaved) {
						// ADD video if not already in playlist
						if (!playlist.videos.includes(videoData.id)) {
							try {
								const res = await api.patch(`/playlists/p/add/${playlist._id}/${videoData.id}`);
								if (res.data.success) {
									setPlaylists((prev) =>
										prev.map((p) =>
											p._id === playlist._id
												? {
														...p,
														isVideoSaved: true,
														videoCount: p.videoCount + 1,
													}
												: p
										)
									);
								}
							} catch (error) {
								console.log("Error saving video in playlist:", error);
							}
						}
					} else {
						// REMOVE video if it exists in playlist
						if (playlist.videos.includes(videoData.id)) {
							try {
								const res = await api.patch(`/playlists/p/remove/${playlist._id}/${videoData.id}`);
								if (res.data.success) {
									setPlaylists((prev) =>
										prev.map((p) =>
											p._id === playlist._id
												? {
														...p,
														isVideoSaved: false,
														videoCount: Math.max(p.videoCount - 1, 0),
													}
												: p
										)
									);
								}
							} catch (error) {
								console.log("Error removing video from playlist:", error);
							}
						}
					}
				})
			);
	
			// Refresh playlists after all API calls finish
			await fetchPlayLists(user._id);
			handleClosePlayList();
		} catch (error) {
			console.log("Something went wrong while saving playlists:", error);
		}
	};
	

	const toggleVideoInPlaylist = (playlistId) => {
		setPlaylists((prevPlaylists) =>
			prevPlaylists.map((playlist) => {
				if (playlist._id === playlistId) {
					const newIsSaved = !playlist.isVideoSaved;
					return {
						...playlist,
						isVideoSaved: newIsSaved,
						videoCount: newIsSaved
							? playlist.videoCount + 1
							: Math.max(playlist.videoCount - 1, 0), // prevent negatives
					};
				}
				return playlist;
			})
		);
	};

	const handleCreatePlaylist = async () => {
		const formData = {
			name: newPlaylistName,
			description: newPlaylistDescription
		}
		try {
			const res = await api.post("/playlists/", formData);

			if (res.data.success) {
				const newPlaylist = {
					id: res.data.data._id,
					name: newPlaylistName,
					videoCount: 1,
					isVideoSaved: true
				};
				setPlaylists([newPlaylist, ...playlists]);
				setNewPlaylistName('');
				setNewPlaylistDescription("");
				setIsCreatingNew(false);
			}
		} catch (error) {
			console.log("Something went wrong while creating playlist ::", error)
		}
	};

	let filteredPlaylists = playlists.filter(playlist =>
		playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
	);
	useEffect(() => {
		filteredPlaylists = playlists.filter(playlist =>
			playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
		);

		// console.log(filteredPlaylists)
	}, [searchQuery, playlists])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // ❌ disable scroll
    } else {
      document.body.style.overflow = ""; // ✅ restore scroll
    }

    return () => {
      document.body.style.overflow = ""; // cleanup on unmount
    };
  }, [isOpen]);

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
							<textarea
								type="text"
								value={newPlaylistDescription}
								onChange={(e) => setNewPlaylistDescription(e.target.value)}
								placeholder="Enter playlist description"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-2 text-sm sm:text-base"
								rows={3}
							/>
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
								<PlayListCard key={playlist._id} playlist={playlist} toggleVideoInPlaylist={toggleVideoInPlaylist} />
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
						onClick={() => handleSavePlayList()}
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