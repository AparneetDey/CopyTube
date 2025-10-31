import React, { useCallback, useEffect, useState } from 'react'
import TweetCard from '../../home/TweetCard';
import TweetComposer from '../../home/TweetComposer';
import api from '../../../services/apiService'
import LoadingSpinner from '../../loading/LoadingSpinner';

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTweets = useCallback( async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await api.get("/tweets/t/all");

      setTweets(res.data.data)
    } catch (error) {
      console.log(error)
      setErrorMessage("Error while fetching tweets");
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets])
  
  if (loading) {
    return (<LoadingSpinner />)
  }

  if (errorMessage) return <p className='text-red-500'>{errorMessage}</p>

  return (
    <section className="max-w-2xl mx-auto py-4 border-x border-gray-200">
      <TweetComposer />

      <div>
        {tweets.map((t) => (
          <TweetCard
            key={t._id}
            t={t}
          />
        ))}
      </div>
    </section>
  )
}

export default Tweets