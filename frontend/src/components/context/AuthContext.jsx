import { createContext, useContext, useState, useEffect, useCallback } from "react"
import api from "../../services/apiService"

// Create Context
const AuthContext = createContext()

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getCurrentUser = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get("/users/current-user");

      setUser(res.data.data.user);
    } catch (error) {
      try {
        const res = await api.post("/users/refresh-token");

        if(res) getCurrentUser();
      } catch (error) {
        console.log("Something went wrong while logging in ::", error);
        setUser(null);
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Check auth status on mount
  useEffect(() => {
    getCurrentUser()
  }, [getCurrentUser])

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
