import type { AiArticleRequest, Article, ArticleList, ArticleReadingProgress, articleRequest, updateReadingProgressRequest, vectorizeArticleRequest } from '@/types/article/article'
import type { ApiResponse } from '@/types/api/apiResponse'

import { articleService } from '@/services/articleService'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

export const useArticleStore = defineStore('article', {
    state: () => ({
        prompt: '' as string,
        streamingController: null as AbortController | null,
        assistantMessage: '' as string,
        isArticleCreated: false as boolean,
    }),
    actions: {
        resetAssistantMessage() {
            this.assistantMessage = ''
        },

        reset() {
            this.prompt = '';
            this.abortStreaming();
            this.assistantMessage = '';
            this.isArticleCreated = false;
        },

        async getArticleList() {
            try {
                const response: ApiResponse<ArticleList[]> = await articleService.getArticleList()
                if (!response.isSuccess) {
                    message.error("獲取文章列表錯誤: " + response.message)
                    return []
                }

                return response.data || [];
            } catch (error) {
                message.error('獲取文章列表失敗，請重試')
                console.error('getArticleList error:', error)
                return []
            }
        },

        async getArticleById(sessionId: number) {
            try {
                const response: ApiResponse<Article> = await articleService.getArticleById(sessionId)
                if (!response.isSuccess) {
                    message.error("獲取文章錯誤: " + response.message)
                }

                return response.data || undefined;
            } catch (error) {
                message.error('獲取文章失敗，請重試')
            }
        },

        async generateArticle(request: articleRequest) {
            try {
                const response: ApiResponse<any> = await articleService.generateArticle(request)
                if (!response.isSuccess) {
                    message.error("生成文章錯誤: " + response.message)
                }
            } catch (error) {
                message.error('生成文章失敗，請重試')
            }
        },

        async deleteArticle(articleId: number) {
            try {
                const response: ApiResponse<any> = await articleService.deleteArticle(articleId)
                if (!response.isSuccess) {
                    message.error("刪除文章錯誤: " + response.message)
                }
            } catch (error) {
                message.error('刪除文章失敗，請重試')
            }
        },

        async vectorizeArticle(request: vectorizeArticleRequest) {
            try {
                const response: ApiResponse<any> = await articleService.vectorizeArticle(request)
                if (!response.isSuccess) {
                    message.error("文章向量化錯誤: " + response.message)
                }
            } catch (error) {
                message.error('文章向量化失敗，請重試')
            }
        },

        async updateArticleReadingProgress(request: updateReadingProgressRequest) {
            try {
                const response: ApiResponse<any> = await articleService.updateArticleReadingProgress(request)
                if (!response.isSuccess) {
                    message.error("更新閲讀文章進度錯誤: " + response.message)
                }
            } catch (error) {
                message.error('更新閲讀文章進度失敗，請重試')
            }
        },

        async getArticleReadingProgress(articleId: number) {
            try {
                const response: ApiResponse<ArticleReadingProgress> = await articleService.getArticleReadingProgress(articleId)
                if (!response.isSuccess && response.code != 401) {
                    message.error("獲取閲讀文章進度錯誤: " + response.message)
                }
                return response.data || undefined;
            } catch (error) {
                message.error('獲取閲讀文章進度失敗，請重試')
            }
        },

        async streamGenerate(aiArticleRequest: AiArticleRequest) {
            try {
                let hasError = false;
                this.isArticleCreated = false;
                this.assistantMessage = '';

                this.abortStreaming();

                this.streamingController = new AbortController();

                const response = await articleService.streamGenerateArticle(
                    {
                        ...aiArticleRequest,
                    },
                    (chunk) => {
                        if (chunk.error) {
                            message.error(chunk.error.message)
                            hasError = true;
                            return;
                        }

                        this.assistantMessage += chunk.content;
                    },
                    this.streamingController.signal
                )

                if (!hasError) {
                    this.isArticleCreated = true;
                }
            } catch (error) {
                message.error('聊天請求錯誤');
                console.error('streamGenerate error:', error);
            } finally {
                this.streamingController = null;
            }
        },

        abortStreaming() {
            if (this.streamingController) {
                this.streamingController.abort();
                this.streamingController = null;
                this.isArticleCreated = false;
            }
        },
    }
})
