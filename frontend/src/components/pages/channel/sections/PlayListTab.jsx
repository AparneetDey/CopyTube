import { List } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import api from '../../../../services/apiService';
import PlayListCard from './PlayListCard';

const PlayListTab = ({ id }) => {
	const [playlists, setPlaylists] = useState([]);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const fetchPlayLists = useCallback(async (id) => {
		setLoading(true);
		setErrorMessage("");

		try {
			const res = await api.get(`/playlists/p/user/${id}`);

			setPlaylists(res.data.data)
		} catch (error) {
			console.log(error);
			setErrorMessage("No PlayList Available");
		}
	});

	useEffect(() => {
		fetchPlayLists(id)
	}, [id, fetchPlayLists])

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-900">Created Playlists</h2>
			</div>

			{playlists && playlists.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{playlists.map((playlist) => (
						<PlayListCard key={playlist._id} playlist={playlist} />
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<List className="w-16 h-16 mx-auto mb-4 text-gray-400" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">No playlists yet</h3>
					<p className="text-gray-600 mb-4">Create playlists to organize your videos</p>
				</div>
			)}
		</div>
	);
}

export default PlayListTab