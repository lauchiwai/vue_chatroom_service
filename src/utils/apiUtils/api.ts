import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { handleUnauthorized } from '@/utils/apiUtils/authApi'
import { useUserStore } from '@/stores/authStore'
import axios from 'axios'

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
