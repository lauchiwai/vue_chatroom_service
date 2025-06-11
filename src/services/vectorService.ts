import type { ApiResponse } from '@/types/api/apiResponse'
import type { checkVectorDataExistRequest } from '@/types/vector/vector';

import { api } from '@/utils/apiUtils/api'

export const vectorService = {
    async checkVectorDataExist(request: checkVectorDataExistRequest): Promise<ApiResponse<boolean>> {
        const response = await api.post<ApiResponse<boolean>>(`/Vector/CheckVectorDataExist`, request)
        return response.data;
    },
}