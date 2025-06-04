import type { AiArticleRequest, articleRequest } from '@/types/article/article'
import type { ApiResponse } from '@/types/api/apiResponse'

import { articleService } from '@/services/articleService'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

export const useArticleStore = defineStore('article', {
    state: () => ({
        prompt: '' as string,
        streamingController: null as AbortController | null,
        assistantMessage: '' as string,
        isArticleCreated: false as boolean
    }),
    actions: {
        resetAssistantMessage() {
            this.assistantMessage = ''
        },
        async generateArticle(request: articleRequest) {
            try {
                const response: ApiResponse<any> = await articleService.generateArticle(request)
                if (!response.isSuccess) {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                message.error('generate article error please try again')
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
                message.error('chat request errer')
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