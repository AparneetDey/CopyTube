import React from 'react'
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import AuthPage from './components/pages/Auth/AuthPage';
import Navbar from './components/Navbar/Navbar'
import ProtectedRoute from './components/helper/ProtectedRoute';
import AuthGuard from './components/helper/AuthGuard';
import Home from './components/pages/Home/Home';

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
        <Route path='/auth' element={<AuthGuard><AuthPage /></AuthGuard>} />

        <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }>
          <Route
            path="tweet" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to={"/home"} replace />} />
      </Routes>
    </main>
  )
}

export default App