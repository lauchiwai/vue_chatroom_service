import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'
import type { AiArticleRequest, Article, ArticleList, articleRequest, vectorizeArticleRequest } from '@/types/article/article'

import { streamClient } from '@/utils/apiUtils/streamApi'
import { api } from '@/utils/apiUtils/api'

export const articleService = {
    async streamGenerateArticle(request: AiArticleRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<any>> {
        return streamClient.chat(request, 'Article/FetchAiArticle', onChunk, signal)
    },
    async generateArticle(request: articleRequest): Promise<ApiResponse<any>> {
        const response = await api.post<ApiResponse<any>>('/Article/GenerateArticle', request)
        return response.data;
    },
    async getArticleList(): Promise<ApiResponse<ArticleList[]>> {
        const response = await api.get<ApiResponse<ArticleList[]>>('/Article/GetArticleList')
        return response.data;
    },
    async getArticleById(sessionId: number): Promise<ApiResponse<Article>> {
        const response = await api.get<ApiResponse<Article>>(`/Article/GetArticle/${sessionId}`)
        return response.data;
    },
    async vectorizeArticle(request: vectorizeArticleRequest): Promise<ApiResponse<any>> {
        const response = await api.post<ApiResponse<any>>(`/Article/VectorizeArticle`, request)
        return response.data;
    },
}