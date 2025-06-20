import type { ApiResponse } from '@/types/api/apiResponse'
import type { ChatSessionResponse } from '@/types/chat/chat'
import type { RagChatRequest, SummaryRequest } from '@/types/chat/rag'
import type { ChatResponse } from '@/types/chat/chat'
import type { ChatHistory, ChatMessage } from '@/types/chatHistory/chatHistory'

import { RagService } from '@/services/ragService'
import { defineStore } from 'pinia'
import { ChatHistoryService } from '@/services/chatHistoryService'
import { message } from 'ant-design-vue'

import dayjs from 'dayjs';

export const useRagStore = defineStore('rag', {
    state: () => ({
        ragChatSessionList: [] as ChatSessionResponse[],
        ragCurrentSession: [] as number[],
        ragMessages: [] as ChatMessage[],
        ragInputText: '' as string,
        ragStreamingController: null as AbortController | null,
        tempAssistantMessage: '' as string,
        isRagAsyncing: false as boolean
    }),
    actions: {
        async fetchChatHistory(sessionId: number) {
            try {
                const response: ApiResponse<ChatHistory> =
                    await ChatHistoryService.getChatHistory(sessionId)
                if (response.isSuccess) {
                    this.ragMessages.length = 0;
                    this.ragMessages = response.data.response
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("getChatSessionList error : ", error)
                message.error('get data error please try again')
            }
        },
        async fetchRagChatSessionListByArticleId(articleId: number) {
            try {
                const response: ApiResponse<ChatSessionResponse[]> = await RagService.getRagChatSessionListByArticleId(articleId)

                if (response.isSuccess) {
                    this.ragChatSessionList = response.data
                    if (response.data.length > 0)
                        this.setRagCurrentSession(response.data[0].sessionId)
                    else
                        this.setRagCurrentSession()
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("getChatSessionList error : ", error)
                message.error('get data error please try again')
            }
        },
        async createRagChatSession(articleId: number) {
            try {
                const response: ApiResponse<ChatSessionResponse> =
                    await RagService.generateRagChatSession(articleId)

                if (response.isSuccess) {
                    this.ragChatSessionList.unshift(response.data)
                    this.setRagCurrentSession(response.data.sessionId)
                    message.success('session create success')
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("createRagChatSession error : ", error)
                message.error('create errer, please try again')
            }
        },
        setRagCurrentSession(sessionId?: number) {
            if (sessionId == null) {
                this.ragCurrentSession = []
                return
            }

            if (this.isRagAsyncing) {
                this.abortStreaming();
            }
            this.ragCurrentSession.length = 0;
            this.ragCurrentSession = [sessionId]
        },
        pushUserQuestion(chatRequest: RagChatRequest) {
            let newMsg: ChatMessage = {
                role: 'user',
                content: chatRequest.message,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }

            this.ragMessages.push(newMsg);
        },
        pushAssistantAnswer(chatResponse: ChatResponse) {
            let newMsg: ChatMessage = {
                role: 'assistant',
                content: chatResponse.response,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }

            this.ragMessages.push(newMsg);
        },
        async streamChat(chatRequest: RagChatRequest) {
            try {
                this.isRagAsyncing = true
                this.pushUserQuestion(chatRequest)
                this.tempAssistantMessage = ''
                this.ragStreamingController = new AbortController()
                const response = await RagService.streamChat(
                    {
                        ...chatRequest,
                        chat_session_id: this.ragCurrentSession[0]
                    },
                    (chunk) => {
                        if (chunk.error) {
                            message.error(chunk.error.message)
                            return
                        }

                        this.tempAssistantMessage += chunk.content
                    },
                    this.ragStreamingController.signal
                )
            } catch (error) {
                message.error('chat request errer')
            } finally {
                this.isRagAsyncing = false
                this.pushAssistantAnswer({
                    response: this.tempAssistantMessage,
                    chat_session_id: this.ragCurrentSession[0]
                })
                this.ragInputText = '';
                this.ragStreamingController = null
                this.tempAssistantMessage = ''
            }
        },
        async streamSummaryChat(summaryRequest: SummaryRequest) {
            try {
                this.isRagAsyncing = true
                this.ragStreamingController = new AbortController()
                const response = await RagService.streamSummaryChat(
                    {
                        ...summaryRequest,
                        chat_session_id: this.ragCurrentSession[0]
                    },
                    (chunk) => {
                        if (chunk.error) {
                            message.error(chunk.error.message)
                            return
                        }

                        this.tempAssistantMessage += chunk.content
                    },
                    this.ragStreamingController.signal
                )
            } catch (error) {
                message.error('chat request errer')
            } finally {
                this.isRagAsyncing = false
                this.pushAssistantAnswer({
                    response: this.tempAssistantMessage,
                    chat_session_id: this.ragCurrentSession[0]
                })
                this.ragInputText = '';
                this.ragStreamingController = null
                this.tempAssistantMessage = ''
            }
        },
        abortStreaming() {
            if (this.ragStreamingController) {
                this.ragStreamingController.abort();
            }
        },
    }
})