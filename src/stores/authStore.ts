import type { JwtPayload, UserState } from '@/types/auth/user'

import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userName: localStorage.getItem('userName'),
        userId: localStorage.getItem('userId'),
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        expiresAt: Number(localStorage.getItem('expiresAt')) || null
    }),
    actions: {
        login(response: { accessToken: string; refreshToken: string }) {
            const payload = decodeJwt(response.accessToken)

            this.userName = payload.UserName
            this.userId = payload.UserId
            this.accessToken = response.accessToken
            this.refreshToken = response.refreshToken
            this.expiresAt = payload.exp * 1000

            localStorage.setItem('userName', payload.UserName)
            localStorage.setItem('userId', payload.UserId)
            localStorage.setItem('accessToken', response.accessToken)
            localStorage.setItem('refreshToken', response.refreshToken)
            localStorage.setItem('expiresAt', String(this.expiresAt))
        },
        updateTokens(response: { accessToken: string; refreshToken: string }) {
            const payload = decodeJwt(response.accessToken)

            this.accessToken = response.accessToken
            this.refreshToken = response.refreshToken
            this.expiresAt = payload.exp * 1000

            localStorage.setItem('accessToken', response.accessToken)
            localStorage.setItem('refreshToken', response.refreshToken)
            localStorage.setItem('expiresAt', String(this.expiresAt))
        },
        logout() {
            this.$reset()
            localStorage.clear()
        }
    }
})

function decodeJwt(token: string): JwtPayload {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(base64)) as JwtPayload
    } catch (e) {
        throw new Error('Invalid JWT token')
    }
}