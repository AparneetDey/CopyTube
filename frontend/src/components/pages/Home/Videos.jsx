import React, { useEffect, useState, useCallback } from 'react'
import api from '../../../services/apiService'
import VideoItem from '../../home/VideoItem'
import { useSearch } from '../../context/SearchContext'
import LoadingSpinner from '../../loading/LoadingSpinner'

const Videos = () => {
	const [videos, setVideos] = useState([])
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const { searchQuery } = useSearch();

	const fetchVideos = useCallback(async (query = '', newPage = 1) => {
		if (loading) return; // prevent duplicate fetches
		setLoading(true);
		setErrorMessage("");

		try {
			const res = await api.get("/videos/", {
				params: {
					search_query: query,
					sortBy: "createdAt",
					sortType: "desc",
					page: newPage,
					limit: 12,
				},
			});

			const newVideos = res.data.data.videos || [];
			setVideos(prev => newPage === 1 ? newVideos : [...prev, ...newVideos]);

			// ✅ Check actual length instead of just backend flag
			if (newVideos.length < 12) {
				setHasMore(false);
			} else {
				setHasMore(true);
			}

		} catch (error) {
			setErrorMessage("No Videos Found");
		} finally {
			setLoading(false);
		}
	}, []);

	//Handle scroll updation
	useEffect(() => {
		const handleScroll = () => {
			const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
			if (bottom && hasMore && !loading) {
				setPage(prev => prev + 1);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [hasMore, loading]);



	useEffect(() => {
		fetchVideos(searchQuery, page);
	}, [page, searchQuery, fetchVideos]);

	useEffect(() => {
		setVideos([]);
		setPage(1);
		setHasMore(true);
		fetchVideos(searchQuery, 1);
	  }, [searchQuery]);	  


	if (errorMessage) return <p className='text-red-500'>{errorMessage}</p>

	return (
		<section>
			<div className='w-full px-6 py-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{videos.map((v) => (
					<VideoItem key={v._id} v={v} />
				))}
			</div>
			<div className='flex justify-center'>
				{loading && <LoadingSpinner />}
			</div>
		</section>
	)
}

export default Videos