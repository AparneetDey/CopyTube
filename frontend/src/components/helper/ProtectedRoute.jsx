import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../loading/LoadingSpinner"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (<LoadingSpinner />)
  }

  // if user not logged in
  if (!user) return <Navigate to="/auth" replace />

  // if logged in
  return children
}

export default ProtectedRoute