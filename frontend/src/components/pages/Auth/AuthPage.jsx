import React, { useEffect, useState } from 'react'
import Register from './Register'
import Login from './Login'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const AuthPage = () => {
  const { getCurrentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isUser, setIsUser] = useState(isAuthenticated);

  console.log(isAuthenticated)

  useEffect(() => {
    if(isUser) {
      getCurrentUser();
      navigate("/home")
    }
  }, [isUser])
  

  return (
    <main className='bg-linear-to-br from-blue-50 to-indigo-100 w-full h-full pt-5 '>
      {isLogin ? <Login setIsLogin={setIsLogin} setIsUser={setIsUser} /> : <Register setIsLogin={setIsLogin} setIsUser={setIsUser} />}
    </main>
  )
}

export default AuthPage;