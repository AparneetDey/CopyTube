import React, { useState } from 'react'
import TweetCard from './TweetCard';

const TweetsTab = ({ id }) => {
  const [tweets, setTweets] = useState([]);

  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Channel Tweets</h2>
      <div className="space-y-4">
        {tweets.map((tweet, index) => (
          <TweetCard key={index} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}

export default TweetsTab