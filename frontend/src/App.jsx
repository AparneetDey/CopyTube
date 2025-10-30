import React from 'react'
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import AuthPage from './components/pages/Auth/AuthPage';

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <main className='min-h-screen flex flex-col '>
      {}
      <Routes>
        <Route path='/auth' element={<AuthPage />} />
      </Routes>
    </main>
  )
}

export default App