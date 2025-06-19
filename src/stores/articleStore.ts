import type {
    AiArticleRequest,
    Article,
    ArticleList,
    ArticleReadingProgress,
    articleRequest,
    updateReadingProgressRequest,
    vectorizeArticleRequest
} from '@/types/article/article'
import type { ApiResponse } from '@/types/api/apiResponse'

import { articleService } from '@/services/articleService'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

export const useArticleStore = defineStore('article', {
    state: () => ({
        articleList: [] as ArticleList[],
        articleCache: new Map<number, Article>(),
        readingProgressCache: new Map<number, ArticleReadingProgress>(),
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

        clearCache() {
            this.articleList = [];
            this.articleCache.clear();
            this.readingProgressCache.clear();
        },

        async getArticleList(forceRefresh = false) {
            try {
                if (!forceRefresh && this.articleList.length > 0) {
                    return this.articleList;
                }

                const response: ApiResponse<ArticleList[]> = await articleService.getArticleList()
                if (!response.isSuccess) {
                    message.error("獲取文章列表錯誤: " + (response.message || "未知錯誤"))
                    return this.articleList;
                }

                this.articleList = response.data || [];
                return this.articleList;
            } catch (error) {
                message.error('獲取文章列表失敗，請重試')
                console.error('getArticleList error:', error)
                return this.articleList;
            }
        },

        async getArticleById(articleId: number, forceRefresh = false) {
            try {
                if (!forceRefresh && this.articleCache.has(articleId)) {
                    return this.articleCache.get(articleId);
                }

                const response: ApiResponse<Article> = await articleService.getArticleById(articleId)
                if (!response.isSuccess) {
                    message.error("獲取文章錯誤: " + (response.message || "未知錯誤"))
                    return this.articleCache.get(articleId);
                }

                if (response.data) {
                    this.articleCache.set(articleId, response.data);
                }

                return response.data;
            } catch (error) {
                message.error('獲取文章失敗，請重試')
                return this.articleCache.get(articleId);
            }
        },

        async generateArticle(request: articleRequest) {
            try {
                const response: ApiResponse<any> = await articleService.generateArticle(request)
                if (response.isSuccess) {
                    this.getArticleList(true);
                    return true;
                } else {
                    message.error("生成文章錯誤: " + (response.message || "未知錯誤"))
                    return false;
                }
            } catch (error) {
                message.error('生成文章失敗，請重試')
                return false;
            }
        },

        async deleteArticle(articleId: number) {
            try {
                const response: ApiResponse<any> = await articleService.deleteArticle(articleId)
                if (response.isSuccess) {
                    this.articleList = this.articleList.filter(article => article.articleId !== articleId);
                    this.articleCache.delete(articleId);
                    this.readingProgressCache.delete(articleId);
                    message.success('文章刪除成功！');
                    return true;
                } else {
                    message.error("刪除文章錯誤: " + (response.message || "未知錯誤"))
                    return false;
                }
            } catch (error) {
                message.error('刪除文章失敗，請重試')
                return false;
            }
        },

        async vectorizeArticle(request: vectorizeArticleRequest) {
            try {
                const response: ApiResponse<any> = await articleService.vectorizeArticle(request)
                if (response.isSuccess) {
                    if (request.articleId) {
                        this.getArticleById(request.articleId, true);
                    }
                    return true;
                } else {
                    message.error("文章向量化錯誤: " + (response.message || "未知錯誤"))
                    return false;
                }
            } catch (error) {
                message.error('文章向量化失敗，請重試')
                return false;
            }
        },

        async updateArticleReadingProgress(request: updateReadingProgressRequest) {
            try {
                const response: ApiResponse<any> = await articleService.updateArticleReadingProgress(request)
                if (response.isSuccess) {
                    if (request.articleId) {
                        const existingProgress = this.readingProgressCache.get(request.articleId) || {};
                        this.readingProgressCache.set(request.articleId, {
                            ...existingProgress,
                            ...request
                        });
                    }
                    return true;
                } else {
                    message.error("更新閲讀文章進度錯誤: " + (response.message || "未知錯誤"))
                    return false;
                }
            } catch (error) {
                message.error('更新閲讀文章進度失敗，請重試')
                return false;
            }
        },

        async getArticleReadingProgress(articleId: number, forceRefresh = false) {
            try {
                if (!forceRefresh && this.readingProgressCache.has(articleId)) {
                    return this.readingProgressCache.get(articleId);
                }

                const response: ApiResponse<ArticleReadingProgress> = await articleService.getArticleReadingProgress(articleId)
                if (!response.isSuccess && response.code != 401) {
                    message.error("獲取閲讀文章進度錯誤: " + (response.message || "未知錯誤"))
                    return this.readingProgressCache.get(articleId);
                }

                if (response.data) {
                    this.readingProgressCache.set(articleId, response.data);
                }

                return response.data;
            } catch (error) {
                message.error('獲取閲讀文章進度失敗，請重試')
                return this.readingProgressCache.get(articleId);
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
                    this.getArticleList(true);
                }
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    message.error('生成文章時發生錯誤');
                    console.error('streamGenerate error:', error);
                }
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
