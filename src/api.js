import axios from 'axios'

// Create one axios instance to use everywhere
// The base URL comes from your .env file
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// This runs before every request
// It automatically attaches the token from localStorage to every API call
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
