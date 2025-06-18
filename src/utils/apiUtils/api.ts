import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useUserStore } from '@/stores/authStore'
import { handleUnauthorized } from '@/utils/apiUtils/authApi'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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
                await handleUnauthorized()
                const userStore = useUserStore()
                originalRequest.headers.Authorization = `Bearer ${userStore.accessToken}`
                return api(originalRequest)
            } catch {
                return Promise.reject(new Error('Token refresh failed'))
            }
        }

        return Promise.reject(error)
    }
)
