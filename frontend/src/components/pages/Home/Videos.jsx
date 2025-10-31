import React, { useEffect, useState, useCallback } from 'react'
import api from '../../../services/apiService'
import VideoItem from '../../home/VideoItem'
import { useSearch } from '../../context/SearchContext'

const Videos = () => {
	const [videos, setVideos] = useState([])
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const { searchQuery } = useSearch();

	const fetchVideos = useCallback(async (query = '') => {
		setLoading(true);
		setErrorMessage("");
		console.log(query)
		try {
			const res = await api.get("/videos/", {
				params: { search_query: query }
			})

			setVideos(res.data.data.videos);
		} catch (error) {
			setErrorMessage("Error fetching videos");
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


	
	return (
		<section className='w-full px-6 py-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{videos.map( (v) => (
				<VideoItem key={v._id} v={v} />
			))}
		</section>
	)
}

export default Videos