import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'
import type { AiArticleRequest, Article, ArticleList, ArticleReadingProgress, articleRequest, updateReadingProgressRequest, vectorizeArticleRequest } from '@/types/article/article'

import { streamClient } from '@/utils/apiUtils/streamApi'
import { api } from '@/utils/apiUtils/api'

export const articleService = {
    async streamGenerateArticle(request: AiArticleRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<any>> {
        return streamClient.chat(request, 'Article/FetchAiArticle', onChunk, signal)
    },
    async generateArticle(request: articleRequest): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/Article/GenerateArticle', request)
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
    async deleteArticle(articleId: number): Promise<ApiResponse<void>> {
        const response = await api.get<ApiResponse<void>>(`/Article/DeleteArticle/${articleId}`)
        return response.data;
    },
    async vectorizeArticle(request: vectorizeArticleRequest): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>(`/Article/VectorizeArticle`, request)
        return response.data;
    },
    async updateArticleReadingProgress(request: updateReadingProgressRequest): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/Article/UpdateArticleReadingProgress', request)
        return response.data;
    },
    async getArticleReadingProgress(articleId: number): Promise<ApiResponse<ArticleReadingProgress>> {
        const response = await api.get<ApiResponse<ArticleReadingProgress>>(`/Article/GetArticleReadingProgress/${articleId}`)
        return response.data;
    },
}