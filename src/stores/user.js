import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {

    // Load saved values from localStorage when the page first loads
    const token = ref(localStorage.getItem('token') || null)
    const isAdmin = ref(JSON.parse(localStorage.getItem('isAdmin')) || false)
    const userId = ref(localStorage.getItem('userId') || null)
    const username = ref(localStorage.getItem('username') || null)

    // Save token to memory and localStorage
    const setToken = (newToken) => {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    // Save admin status
    const setAdmin = (value) => {
        isAdmin.value = value
        localStorage.setItem('isAdmin', JSON.stringify(value))
    }

    // Save user id and username
    const setUser = (id, name) => {
        userId.value = id
        username.value = name
        localStorage.setItem('userId', id)
        localStorage.setItem('username', name)
    }

    // Clear everything on logout
    const clearToken = () => {
        token.value = null
        isAdmin.value = false
        userId.value = null
        username.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
    }

    // Helper to check if user is logged in
    const isAuthenticated = () => !!token.value

    return { token, isAdmin, userId, username, setToken, setAdmin, setUser, clearToken, isAuthenticated }
})
