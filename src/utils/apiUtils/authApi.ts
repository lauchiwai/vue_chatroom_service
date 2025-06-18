import { useUserStore } from '@/stores/authStore'
import { UserService } from '@/services/userService'

type RefreshSubscriber = {
    resolve: (value: boolean) => void
    reject: (reason?: any) => void
}

let isRefreshing = false
let refreshSubscribers: RefreshSubscriber[] = []
let lastRefreshTime = 0
const REFRESH_COOLDOWN = 5000

export const handleUnauthorized = async (): Promise<boolean> => {
    const userStore = useUserStore()
    const now = Date.now()

    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
        throw new Error(`Please wait ${REFRESH_COOLDOWN / 1000} seconds and try again`)
    }

    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            refreshSubscribers.push({ resolve, reject })
        })
    }

    isRefreshing = true
    lastRefreshTime = now

    try {
        if (!userStore.refreshToken) {
            throw new Error('REFRESH_TOKEN_MISSING')
        }

        const response = await UserService.refreshToken(userStore.refreshToken)
        if (!response.isSuccess) throw new Error('Refresh token failed')

        userStore.updateTokens(response.data)
        refreshSubscribers.forEach(({ resolve }) => resolve(true))
        return true
    } catch (error) {
        refreshSubscribers.forEach(({ reject }) => reject(error))
        handleLogout(error instanceof Error ? error.message : 'REFRESH_ERROR')
        return false
    } finally {
        isRefreshing = false
        refreshSubscribers = []
    }
}

const handleLogout = (reason: string) => {
    const userStore = useUserStore()
    userStore.logout()
    console.error(`[Auth] logout reason : ${reason}`)
    window.location.href = '/login'
}
