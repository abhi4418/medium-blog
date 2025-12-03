import axios from "axios"
import { BACKEND_URL } from "../config"

// Cache for user ID to avoid multiple API calls
let cachedUserId: string | null = null
let cachePromise: Promise<string | null> | null = null

// Utility function to get user ID from backend API
export const getUserIdFromToken = async (): Promise<string | null> => {
    const token = localStorage.getItem("token")
    if (!token) {
        cachedUserId = null
        return null
    }

    // Return cached value if available
    if (cachedUserId) {
        return cachedUserId
    }

    // If there's already a request in progress, return that promise
    if (cachePromise) {
        return cachePromise
    }

    // Make API call to get user ID
    cachePromise = axios
        .get(`${BACKEND_URL}/api/v1/user/me`, {
            headers: {
                Authorization: token,
            },
        })
        .then((response) => {
            const userId = response.data.id || null
            cachedUserId = userId
            cachePromise = null
            return userId
        })
        .catch((error) => {
            console.error("Error fetching user ID:", error)
            cachedUserId = null
            cachePromise = null
            return null
        })

    return cachePromise
}

// Clear the cache (useful when user logs out)
export const clearUserIdCache = () => {
    cachedUserId = null
    cachePromise = null
}

// Logout function - removes token from localStorage and clears cache
export const logout = () => {
    localStorage.removeItem("token")
    clearUserIdCache()
}

