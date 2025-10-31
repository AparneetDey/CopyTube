import React from 'react'
import Videos from './Videos'
import { useLocation } from 'react-router-dom'
import Tweets from './Tweets';

const Home = () => {
  const location = useLocation();
  const isTweet = location.pathname.includes("/tweet");

  return (
    <main>
      {isTweet ? (<Tweets />) : ( <Videos />)}
    </main>
  )
}

export default Home