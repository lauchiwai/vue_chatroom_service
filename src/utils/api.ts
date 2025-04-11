import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { RefreshResponse } from '@/types/auth/user'
import type { ApiResponse } from '@/types/api/apiResponse'

import { useUserStore } from '@/stores/authStore'
import { UserService } from '@/services/userService'
import { handleUnauthorized } from '@/utils/authApi'

import axios from 'axios'

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
        const userStore = useUserStore()

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshSuccess = await handleUnauthorized()

                if (refreshSuccess) {
                    originalRequest.headers.Authorization = `Bearer ${userStore.accessToken}`
                    return api(originalRequest)
                } else {
                    return Promise.reject(new Error('token refresh error'))
                }
            } catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)