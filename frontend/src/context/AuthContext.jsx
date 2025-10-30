import { createContext, useContext, useState, useEffect } from "react"

// Create Context
const AuthContext = createContext()

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Example: check for user data in localStorage on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext)
