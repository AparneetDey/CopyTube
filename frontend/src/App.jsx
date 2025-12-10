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
import VideoPage from './components/pages/Player/VideoPage';
import UploadPage from './components/pages/Upload/UploadPage';
import ChannelPage from "./components/pages/channel/ChannelPage"
import SaveToPlaylistModal from "./components/playlist-modal/SaveToPlayListModal"
import PlaylistPage from './components/pages/Playlist/PlaylistPage';

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <main className='min-h-screen flex flex-col '>
      <SaveToPlaylistModal />
      {!isAuthPage && (
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

        <Route
          path='/watch/:videoId'
          element={
            <ProtectedRoute>
              <VideoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/upload'
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/channel/:username'
          element={
            <ProtectedRoute>
              <ChannelPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/playlist/:playlistId'
          element={
            <ProtectedRoute>
              <PlaylistPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to={"/home"} replace />} />
      </Routes>
    </main>
  )
}

export default App