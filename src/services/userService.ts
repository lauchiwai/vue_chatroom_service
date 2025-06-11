import type { LoginResponse, RefreshResponse } from '@/types/auth/user'
import type { ApiResponse } from '@/types/api/apiResponse'
import { api } from '@/utils/apiUtils/api'
import { useUserStore } from '@/stores/authStore'

export const UserService = {
    async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post<ApiResponse<LoginResponse>>('/Authenticate/Login', {
            userName: username,
            password: password
        })

        if (response.data.isSuccess && response.data.data) {
            const userStore = useUserStore()
            userStore.login(response.data.data)
        }

        return response.data
    },

    async refreshToken(refreshToken: string): Promise<ApiResponse<RefreshResponse>> {
        const response = await api.post<ApiResponse<RefreshResponse>>(
            `/Authenticate/Refresh?refreshToken=${encodeURIComponent(refreshToken)}`
        )

        if (response.data.isSuccess && response.data.data) {
            const userStore = useUserStore()
            userStore.updateTokens(response.data.data)
        }

        return response.data
    }
}