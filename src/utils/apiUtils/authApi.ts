import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/authStore'
import { UserService } from '@/services/userService'
import axios from 'axios'

let refreshPromise: Promise<boolean> | null = null

export const handleUnauthorized = async (): Promise<boolean> => {
    const userStore = useUserStore()
    const refreshToken = userStore.refreshToken

    if (!refreshToken) {
        handleLogout('REFRESH_TOKEN_MISSING')
        return false
    }

    if (refreshPromise) {
        return refreshPromise
    }

    refreshPromise = (async () => {
        try {
            const response = await UserService.refreshToken(refreshToken)
            if (!response.isSuccess) {
                throw new Error('Refresh token failed: ' + (response.message || 'Unknown error'))
            }
            userStore.updateTokens(response.data)
            return true
        } catch (error) {
            console.error('Token refresh failed:', error)
            handleLogout('REFRESH_ERROR')
            return false
        } finally {
            refreshPromise = null
        }
    })()

    return refreshPromise
}

export const handleLogout = (reason: string) => {
    const userStore = useUserStore()
    userStore.logout()
    console.error(`[Auth] Logout triggered. Reason: ${reason}`)
    window.location.href = '/login'
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.accessToken) {
        config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const refreshSuccess = await handleUnauthorized()
                if (refreshSuccess) {
                    const userStore = useUserStore()
                    originalRequest.headers.Authorization = `Bearer ${userStore.accessToken}`
                    return api(originalRequest)
                }
                return Promise.reject(new Error('Token refresh failed'))
            } catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)
