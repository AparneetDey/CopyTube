import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  // if already logged in, redirect to home
  if (user) return <Navigate to="/home" replace />

  // if not logged in, show auth page
  return children
}

export default AuthGuard

