import { createContext, useContext, useState, useEffect } from "react"
import api from "../../services/apiService"

// Create Context
const AuthContext = createContext()

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getCurrentUser = async () => {
    setLoading(true)
    try {
      const res = await api.get("/users/current-user");

      console.log(res)

      setUser(res.data.data.user);
    } catch (error) {
      console.log("Something went wrong while fetching user :: ", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext)
