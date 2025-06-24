import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'
import type { AiArticleRequest, Article, ArticleList, ArticleReadingProgress, articleRequest, updateReadingProgressRequest, vectorizeArticleRequest } from '@/types/article/article'
import type { PagedViewModel, SearchParams } from '@/types/search/search'

import { streamClient } from '@/utils/apiUtils/streamApi'
import { api } from '@/utils/apiUtils/api'

export const articleService = {
    async getArticleList(params?: SearchParams): Promise<ApiResponse<PagedViewModel<ArticleList[]>>> {
        const queryParams: Record<string, string> = {};

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value === undefined || value === null) return;

                if (value instanceof Date) {
                    queryParams[key] = value.toISOString();
                } else if (typeof value === 'object') {
                    queryParams[key] = JSON.stringify(value);
                } else {
                    queryParams[key] = value.toString();
                }
            });
        }

        const queryString = Object.keys(queryParams).length
            ? '?' + new URLSearchParams(queryParams).toString()
            : '';

        const response = await api.get<ApiResponse<PagedViewModel<ArticleList[]>>>(`/Article/GetArticleList${queryString}`);
        return response.data;
    },
    async streamGenerateArticle(request: AiArticleRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<any>> {
        return streamClient.chat(request, 'Article/FetchAiArticle', onChunk, signal)
    },
    async generateArticle(request: articleRequest): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/Article/GenerateArticle', request)
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