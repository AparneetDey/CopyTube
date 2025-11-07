import React, { useCallback, useEffect, useState } from 'react'
import TweetCard from './TweetCard';
import api from '../../../../services/apiService';
import LoadingSpinner from '../../../loading/LoadingSpinner';

const TweetsTab = ({ channel }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTweets = useCallback( async (id) => {
    setLoading(false);
    setErrorMessage("");
    try {
      const res = await api.get(`/tweets/t/c/${id}`);
      setTweets(res.data.data)
    } catch (error) {
      console.log("Something went wrong while fetching tweets ::", error);
      setErrorMessage("No tweets Available");
    }
  }, [])

  useEffect(() => {
    fetchTweets(channel._id)
  }, [channel])

  if(loading) return <LoadingSpinner />
  

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Channel Tweets</h2>
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <TweetCard key={tweet._id} tweet={tweet} channel={channel} />
        ))}
      </div>
    </div>
  );
}

export default TweetsTab