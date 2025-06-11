import { useUserStore } from '@/stores/authStore'
import { UserService } from '@/services/userService'

type RefreshSubscriber = () => Promise<void>

let isRefreshing = false
let refreshSubscribers: RefreshSubscriber[] = []
let lastRefreshTime = 0
const REFRESH_COOLDOWN = 5000

export const handleUnauthorized = async (): Promise<boolean> => {
    const userStore = useUserStore()

    const now = Date.now()
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
        throw new Error(`please wait ${REFRESH_COOLDOWN / 1000} seconds and try again`)
    }
    lastRefreshTime = now

    if (!userStore.refreshToken) {
        handleLogout('REFRESH_TOKEN_MISSING')
        return false
    }

    if (isRefreshing) {
        return new Promise((resolve) => {
            refreshSubscribers.push(async () => {
                resolve(true)
            })
        })
    }

    isRefreshing = true
    try {
        const response = await UserService.refreshToken(userStore.refreshToken)
        if (response.isSuccess) {
            userStore.updateTokens(response.data)
            refreshSubscribers.forEach(subscriber => subscriber())
            refreshSubscribers = []
            return true
        }
        throw new Error('refresh token error')
    } catch (error) {
        handleLogout('REFRESH_ERROR')
        return false
    } finally {
        isRefreshing = false
    }
}

const handleLogout = (reason: string) => {
    const userStore = useUserStore()
    userStore.logout()
    console.error(`[Auth] logout reason : ${reason}`)
    window.location.href = '/login'
}