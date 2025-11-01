import React, { useEffect, useState, useCallback } from 'react'
import api from '../../../services/apiService'
import VideoItem from '../../home/VideoItem'
import { useSearch } from '../../context/SearchContext'
import LoadingSpinner from '../../loading/LoadingSpinner'

const Videos = () => {
	const [videos, setVideos] = useState([])
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const { searchQuery } = useSearch();

	const fetchVideos = useCallback(async (query = '') => {
		setLoading(true);
		setErrorMessage("");
		try {
			const res = await api.get("/videos/", {
				params: { 
					search_query: query,
					sortBy: "createdAt",
					sortType: "desc"
				 }
			})

			setVideos(res.data.data.videos);
		} catch (error) {
			setErrorMessage("No Videos Found");
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchVideos();
	}, [fetchVideos])

	useEffect(() => {
		fetchVideos(searchQuery);
	}, [searchQuery, fetchVideos])

	if (loading) {
		return (<LoadingSpinner />)
	}

	if (errorMessage) return <p className='text-red-500'>{errorMessage}</p>

	return (
		<section className='w-full px-6 py-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{videos.map((v) => (
				<VideoItem key={v._id} v={v} />
			))}
		</section>
	)
}

export default Videos