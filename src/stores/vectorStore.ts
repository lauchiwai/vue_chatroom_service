import type { ApiResponse } from '@/types/api/apiResponse'
import type { checkVectorDataExistRequest } from '@/types/vector/vector';

import { vectorService } from '@/services/vectorService'
import { defineStore } from 'pinia'

export const useVectorStore = defineStore('vectorStore', {
    state: () => ({
    }),
    actions: {
        async checkVectorDataExist(request: checkVectorDataExistRequest) {
            try {
                const response: ApiResponse<boolean> = await vectorService.checkVectorDataExist(request)
                return response.data
            } catch (error) {
                console.error('checkVectorDataExist error:', error)
                return false
            }
        },
    }
})
