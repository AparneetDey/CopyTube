import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  console.log(!user)

  if (loading) return <div>Loading...</div>

  // if user not logged in
  if (!user) return <Navigate to="/auth" replace />

  // if logged in
  return children
}

export default ProtectedRoute