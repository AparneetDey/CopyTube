import React, { useState } from 'react'
import Register from './Register'
import Login from './Login'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className='bg-linear-to-br from-blue-50 to-indigo-100 w-full h-full pt-5 '>
      {isLogin ? <Login setIsLogin={setIsLogin} /> : <Register setIsLogin={setIsLogin} />}
    </main>
  )
}

export default AuthPage;