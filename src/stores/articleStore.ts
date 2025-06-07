import type { AiArticleRequest, Article, ArticleList, articleRequest } from '@/types/article/article'
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

        async getArticleList() {
            try {
                const response: ApiResponse<ArticleList[]> = await articleService.getArticleList()
                if (!response.isSuccess) {
                    message.error("获取文章列表错误: " + response.message)
                    return []
                }

                return response.data || [];
            } catch (error) {
                message.error('获取文章列表失败，请重试')
                console.error('getArticleList error:', error)
                return []
            }
        },

        async getArticleById(sessionId: string) {
            try {
                const response: ApiResponse<Article> = await articleService.getArticleById(sessionId)
                if (!response.isSuccess) {
                    message.error("获取文章错误: " + response.message)
                }

                return response.data || undefined;
            } catch (error) {
                message.error('获取文章失败，请重试')
            }
        },

        async generateArticle(request: articleRequest) {
            try {
                const response: ApiResponse<any> = await articleService.generateArticle(request)
                if (!response.isSuccess) {
                    message.error("生成文章错误: " + response.message)
                }
            } catch (error) {
                message.error('生成文章失败，请重试')
            }
        },

        async streamGenerate(aiArticleRequest: AiArticleRequest) {
            try {
                let hasError = false;
                this.isArticleCreated = false;
                this.assistantMessage = ''
                this.streamingController = new AbortController()

                const response = await articleService.streamGenerateArticle(
                    {
                        ...aiArticleRequest,
                    },
                    (chunk) => {
                        if (chunk.error) {
                            message.error(chunk.error.message)
                            return
                        }

                        this.assistantMessage += chunk.content
                    },
                    this.streamingController.signal
                )

                if (!hasError) {
                    this.isArticleCreated = true;
                }
            } catch (error) {
                message.error('聊天请求错误')
            } finally {
                this.streamingController = null
            }
        },

        abortStreaming() {
            if (this.streamingController) {
                this.streamingController.abort();
                this.isArticleCreated = false;
            }
        },
    }
})
