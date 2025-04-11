import type { ApiResponse } from '@/types/api/apiResponse'
import type { ChatSessionResponse, ChatRequest, ChatResponse } from '@/types/chat/chatSession'
import type { ChatMessage, ChatHistory } from '@/types/chatHistory/chatHistory'

import { ChatHistoryService } from '@/services/chatHistoryService'
import { ChatService } from '@/services/chatService'
import { defineStore } from 'pinia'

import { message } from 'ant-design-vue'
import dayjs from 'dayjs';

export const useChatStore = defineStore('chat', {
    state: () => ({
        chatSessionList: [] as ChatSessionResponse[],
        currentSession: [] as string[],
        messages: [] as ChatMessage[],
        inputText: '' as string,
        streamingController: null as AbortController | null,
        tempAssistantMessage: '' as string
    }),
    actions: {
        async fetchChatSessionList() {
            try {
                const response: ApiResponse<ChatSessionResponse[]> = await ChatService.getChatSessionList()

                if (response.isSuccess) {
                    this.chatSessionList = response.data
                    if (response.data.length > 0) {
                        this.setCurrentSession(response.data[0].sessionId.toString())
                    } else {
                        await this.createChatSession();
                        await this.fetchChatSessionList();
                    }
                } else {
                    message.error("錯誤訊息: " + response.message)
                }
            } catch (error) {
                console.error("getChatSessionList error : ", error)
                message.error('發生錯誤，請稍後刷新頁面')
            }
        },
        async fetchChatHistory(sessionId: string) {
            try {
                const response: ApiResponse<ChatHistory> =
                    await ChatHistoryService.getChatHistoryBySessionId(sessionId)

                if (response.isSuccess) {
                    this.messages = response.data.response
                } else {
                    message.error("錯誤訊息: " + response.message)
                }
            } catch (error) {
                console.error("getChatSessionList error : ", error)
                message.error('發生錯誤，請稍後刷新頁面')
            }
        },
        async createChatSession() {
            try {
                const response: ApiResponse<ChatSessionResponse> =
                    await ChatService.generateChatSession()

                if (response.isSuccess) {
                    this.chatSessionList.unshift(response.data)
                    this.setCurrentSession(response.data.sessionId.toString())
                    await this.fetchChatHistory(response.data.sessionId.toString())
                    message.success('会话创建成功')
                } else {
                    message.error("錯誤訊息: " + response.message)
                }
            } catch (error) {
                console.error("createChatSession error : ", error)
                message.error('發生錯誤，請稍後再試')
            }
        },
        async deleteChatData(sessionId: string) {
            try {
                const response: ApiResponse<ChatSessionResponse> =
                    await ChatService.deleteChatData(sessionId)

                if (response.isSuccess) {
                    message.success('刪除成功')
                    await this.fetchChatSessionList()
                    await this.fetchChatHistory(this.currentSession[0])
                } else {
                    message.error("錯誤訊息: " + response.message)
                }
            } catch (error) {
                console.error("createChatSession error : ", error)
                message.error('發生錯誤，請稍後再試')
            }
        },
        async chat(chatRequest: ChatRequest) {
            try {
                const response: ApiResponse<ChatResponse> = await ChatService.chat(chatRequest)
                if (response.isSuccess) {
                    this.pushUserQuestion(chatRequest);
                    this.pushAssistantAnswer(response.data);
                    this.inputText = '';
                } else {
                    message.error("錯誤訊息: " + response.message);
                }
            } catch (error) {
                console.error("chat error : ", error)
                message.error('發生錯誤，請稍後再試')
            }
        },
        setCurrentSession(sessionId: string) {
            this.currentSession = [sessionId]
        },
        pushUserQuestion(chatRequest: ChatRequest) {
            let newMsg: ChatMessage = {
                role: 'user',
                content: chatRequest.message,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }

            this.messages.push(newMsg);
        },
        pushAssistantAnswer(chatResponse: ChatResponse) {
            let newMsg: ChatMessage = {
                role: 'assistant',
                content: chatResponse.response,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }

            this.messages.push(newMsg);
        },
        async steamChat(chatRequest: ChatRequest) {
            try {
                this.pushUserQuestion(chatRequest)
                this.tempAssistantMessage = ''
                this.streamingController = new AbortController()
                const response = await ChatService.streamChat(
                    {
                        ...chatRequest,
                        chat_session_id: this.currentSession[0]
                    },
                    (chunk) => {
                        if (chunk.error) {
                            message.error(chunk.error.message)
                            return
                        }

                        this.tempAssistantMessage += chunk.content
                    }
                )
                if (response.isSuccess) {
                    this.pushAssistantAnswer({
                        response: this.tempAssistantMessage,
                        chat_session_id: this.currentSession[0]
                    })
                } else {
                    message.error(response.message)
                }
            } catch (error) {
                message.error('请求发送失败')
            } finally {
                this.inputText = '';
                this.streamingController = null
                this.tempAssistantMessage = ''
            }
        },
        abortStreaming() {
            if (this.streamingController) {
                this.streamingController.abort()
                this.streamingController = null
                this.tempAssistantMessage = ''
            }
        }
    }
})