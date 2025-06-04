import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'
import type { AiArticleRequest, articleRequest } from '@/types/article/article'

import { streamClient } from '@/utils/streamApi'
import { api } from '@/utils/api'

export const articleService = {
    async streamGenerateArticle(request: AiArticleRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<any>> {
        return streamClient.chat(request, 'Article/FetchAiArticle', onChunk, signal)
    },
    async generateArticle(request: articleRequest): Promise<ApiResponse<any>> {
        const response = await api.post<ApiResponse<any>>('/Article/GenerateArticle', request)
        return response.data;
    },
}