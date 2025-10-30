import axios from "axios"

// Create an instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1", // your backend URL
  timeout: 10000, // optional
})

// Optional: Add interceptors for tokens or logging
api.interceptors.request.use(
  (config) => {
    // Example: attach JWT token
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api
