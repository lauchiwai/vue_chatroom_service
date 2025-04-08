import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { RefreshResponse } from '@/types/auth/user'
import type { ApiResponse } from '@/types/api/apiResponse'

import { useUserStore } from '@/stores/authStore'
import { UserService } from '@/services/userService'

import axios from 'axios'

type RefreshSubscriber = (newToken: string) => void

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


let isRefreshing = false
let refreshSubscribers: RefreshSubscriber[] = []
let lastRefreshTime = 0
const REFRESH_COOLDOWN = 5000

function onRefreshed(token: string) {
    refreshSubscribers.forEach(cb => cb(token))
    refreshSubscribers = []
}

function handleLogout(reason: string = 'UNKNOWN') {
    const userStore = useUserStore()

    userStore.logout()
    console.error(`[Auth] 退出登录原因: ${reason}`)
    window.location.href = `/login`
}

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config
        const userStore = useUserStore()

        // 處理 401 
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("aaaa")
            if (!userStore.refreshToken) {
                handleLogout('REFRESH_TOKEN_MISSING')
                return Promise.reject(error)
            }

            // 防抖
            const now = Date.now()
            if (now - lastRefreshTime < REFRESH_COOLDOWN) {
                return Promise.reject(new Error(`请等待 ${REFRESH_COOLDOWN / 1000} 秒后重试`))
            }
            lastRefreshTime = now

            // retry mark
            originalRequest._retry = true

            if (!isRefreshing) {
                isRefreshing = true
                try {
                    const response: ApiResponse<RefreshResponse> = await UserService.refreshToken(userStore.refreshToken)
                    if (response.isSuccess) {
                        userStore.updateTokens({
                            accessToken: response.data.accessToken,
                            refreshToken: response.data.refreshToken
                        })
                    } else {
                        throw new Error('刷新失败')
                    }

                    if (!userStore.accessToken) {
                        handleLogout('REFRESH_FAILED')
                        throw new Error('刷新后未获得有效 token')
                    }

                    isRefreshing = false
                    onRefreshed(userStore.accessToken)
                    return api(originalRequest)
                } catch (refreshError) {
                    handleLogout('REFRESH_ERROR')
                    return Promise.reject(refreshError)
                }
            }

            // 隊列處理優化
            return new Promise<AxiosResponse>((resolve, reject) => {
                refreshSubscribers.push((newToken: string) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    resolve(api(originalRequest))
                })
            })
        }

        return Promise.reject(error)
    }
)