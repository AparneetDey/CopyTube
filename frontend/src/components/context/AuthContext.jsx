import { createContext, useContext, useState, useEffect } from "react"
import api from "../../services/apiService"
import { useLocation } from "react-router-dom"

// Create Context
const AuthContext = createContext()

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const getCurrentUser = async () => {
    setLoading(true)
    try {
      const res = await api.get("/users/current-user");

      setUser(res.data.data.user);
    } catch (error) {
      console.log("Something went wrong while fetching user :: ", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    getCurrentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext)
