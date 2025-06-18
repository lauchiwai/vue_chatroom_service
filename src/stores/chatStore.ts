import type { ApiResponse } from '@/types/api/apiResponse'
import type { ChatSessionResponse, ChatRequest, ChatResponse, SummaryRequest } from '@/types/chat/chat'
import type { ChatMessage, ChatHistory } from '@/types/chatHistory/chatHistory'

import { ChatHistoryService } from '@/services/chatHistoryService'
import { ChatService } from '@/services/chatService'
import { defineStore } from 'pinia'

import { message } from 'ant-design-vue'
import dayjs from 'dayjs';

export const useChatStore = defineStore('chat', {
    state: () => ({
        chatSessionList: [] as ChatSessionResponse[],
        currentSession: [] as number[],
        messages: [] as ChatMessage[],
        inputText: '' as string,
        streamingController: null as AbortController | null,
        tempAssistantMessage: '' as string,
        isChatAsyncing: false as boolean
    }),
    actions: {
        async fetchChatSessionList() {
            try {
                const response: ApiResponse<ChatSessionResponse[]> = await ChatService.getChatSessionList()

                if (response.isSuccess) {
                    this.chatSessionList = response.data
                    if (response.data.length > 0) {
                        this.setCurrentSession(response.data[0].sessionId)
                    } else {
                        await this.createChatSession();
                    }
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
                const response: ApiResponse<ChatSessionResponse[]> = await ChatService.getRagChatSessionListByArticleId(articleId)

                if (response.isSuccess) {
                    this.chatSessionList = response.data
                    if (response.data.length > 0) {
                        this.setCurrentSession(response.data[0].sessionId)
                    } else {
                        await this.createRagChatSession(articleId);
                    }
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("getChatSessionList error : ", error)
                message.error('get data error please try again')
            }
        },
        async fetchChatHistory(sessionId: number) {
            try {
                const response: ApiResponse<ChatHistory> =
                    await ChatHistoryService.getChatHistory(sessionId)
                if (response.isSuccess) {
                    this.messages.length = 0;
                    this.messages = response.data.response
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("getChatSessionList error : ", error)
                message.error('get data error please try again')
            }
        },
        async createChatSession() {
            try {
                const response: ApiResponse<ChatSessionResponse> =
                    await ChatService.generateChatSession()

                if (response.isSuccess) {
                    this.chatSessionList.unshift(response.data)
                    this.setCurrentSession(response.data.sessionId)
                    message.success('session create success')
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("createChatSession error : ", error)
                message.error('create errer, please try again')
            }
        },
        async createRagChatSession(articleId: number) {
            try {
                const response: ApiResponse<ChatSessionResponse> =
                    await ChatService.generateRagChatSession(articleId)

                if (response.isSuccess) {
                    this.chatSessionList.unshift(response.data)
                    this.setCurrentSession(response.data.sessionId)
                    message.success('session create success')
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("createRagChatSession error : ", error)
                message.error('create errer, please try again')
            }
        },
        async deleteChatData(sessionId: number) {
            try {
                const response: ApiResponse<object> =
                    await ChatService.deleteChatData(sessionId)

                if (response.isSuccess) {
                    message.success('delete success')
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("createChatSession error : ", error)
                message.error('delete errer, please try again')
            }
        },
        async refreshChatSessionTime(sessionId: number) {
            try {
                const response: ApiResponse<object> = await ChatService.refreshChatSessionTime(sessionId)
                if (response.isSuccess) {
                    console.log("refresh success")
                } else {
                    message.error("errer message: " + response.message);
                }
            } catch (error) {
                console.error("chat error : ", error)
                message.error('chat request errer, please try again')
            }
        },
        setCurrentSession(sessionId: number) {
            if (this.isChatAsyncing) {
                this.abortStreaming();
            }
            this.currentSession.length = 0;
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
        async streamChat(chatRequest: ChatRequest) {
            try {
                this.isChatAsyncing = true
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
                    },
                    this.streamingController.signal
                )
            } catch (error) {
                message.error('chat request errer')
            } finally {
                this.isChatAsyncing = false
                this.pushAssistantAnswer({
                    response: this.tempAssistantMessage,
                    chat_session_id: this.currentSession[0]
                })
                this.inputText = '';
                this.streamingController = null
                this.tempAssistantMessage = ''
            }
        },
        async streamSummaryChat(summaryRequest: SummaryRequest) {
            try {
                this.isChatAsyncing = true
                this.streamingController = new AbortController()
                const response = await ChatService.streamSummaryChat(
                    {
                        ...summaryRequest,
                        chat_session_id: this.currentSession[0]
                    },
                    (chunk) => {
                        if (chunk.error) {
                            message.error(chunk.error.message)
                            return
                        }

                        this.tempAssistantMessage += chunk.content
                    },
                    this.streamingController.signal
                )
            } catch (error) {
                message.error('chat request errer')
            } finally {
                this.isChatAsyncing = false
                this.pushAssistantAnswer({
                    response: this.tempAssistantMessage,
                    chat_session_id: this.currentSession[0]
                })
                this.inputText = '';
                this.streamingController = null
                this.tempAssistantMessage = ''
            }
        },
        abortStreaming() {
            if (this.streamingController) {
                this.streamingController.abort();
            }
        },
    }
})