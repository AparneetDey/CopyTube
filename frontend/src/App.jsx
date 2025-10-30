import React from 'react'
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import AuthPage from './components/pages/Auth/AuthPage';
import Navbar from './components/Navbar/Navbar'

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <main className='min-h-screen flex flex-col '>
      { !isAuthPage && (
        <>
          <Navbar />
        </>
      )}
      <Routes>
        <Route path='/auth' element={<AuthPage />} />
        <Route path="/home" element={<></>} />
        <Route path="/" element={<Navigate to={"/home"} />} />
      </Routes>
    </main>
  )
}

export default App