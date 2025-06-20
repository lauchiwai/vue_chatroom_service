import type { ApiResponse } from '@/types/api/apiResponse'
import type { ChatSessionRequset, ChatSessionResponse } from '@/types/chat/chat'
import type { SceneChatRequest } from '@/types/chat/sceneChat'
import type { ChatHistory, ChatMessage } from '@/types/chatHistory/chatHistory'
import type { ChatResponse } from '@/types/chat/chat'

import { SceneChatService } from '@/services/sceneChatService'
import { ChatHistoryService } from '@/services/chatHistoryService'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

import dayjs from 'dayjs';


export const useSceneChatStore = defineStore('sceneChat', {
    state: () => ({
        sceneChatSessionList: [] as ChatSessionResponse[],
        sceneCurrentSession: [] as number[],
        sceneMessages: [] as ChatMessage[],
        sceneInputText: '' as string,
        sceneStreamingController: null as AbortController | null,
        tempAssistantMessage: '' as string,
        isSceneChatAsyncing: false as boolean
    }),
    actions: {
        async fetchChatHistory(sessionId: number) {
            try {
                const response: ApiResponse<ChatHistory> =
                    await ChatHistoryService.getChatHistory(sessionId)
                if (response.isSuccess) {
                    this.sceneMessages.length = 0;
                    this.sceneMessages = response.data.response
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("getChatSessionList error : ", error)
                message.error('get data error please try again')
            }
        },
        async getSceneChatSessionList() {
            try {
                const response: ApiResponse<ChatSessionResponse[]> = await SceneChatService.getSceneChatSessionList()

                if (response.isSuccess) {
                    this.sceneChatSessionList = response.data
                    if (response.data.length > 0)
                        this.setCurrentSession(response.data[0].sessionId)
                    else
                        this.setCurrentSession()
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("getSceneChatSessionList error : ", error)
                message.error('get data error please try again')
            }
        },
        async generateSceneChatSession(request: ChatSessionRequset) {
            try {
                const response: ApiResponse<ChatSessionResponse> =
                    await SceneChatService.generateSceneChatSession(request)

                if (response.isSuccess) {
                    this.sceneChatSessionList.unshift(response.data)
                    this.setCurrentSession(response.data.sessionId)
                    message.success('session create success')
                } else {
                    message.error("errer message: " + response.message)
                }
            } catch (error) {
                console.error("generateSceneChatSession error : ", error)
                message.error('create errer, please try again')
            }
        },
        setCurrentSession(sessionId?: number) {
            if (sessionId == null) {
                this.sceneCurrentSession = []
                return
            }

            if (this.isSceneChatAsyncing) {
                this.abortStreaming();
            }
            this.sceneCurrentSession.length = 0;
            this.sceneCurrentSession = [sessionId]
        },
        pushUserQuestion(request: SceneChatRequest) {
            let newMsg: ChatMessage = {
                role: 'user',
                content: request.message,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }

            this.sceneMessages.push(newMsg);
        },
        pushAssistantAnswer(chatResponse: ChatResponse) {
            let newMsg: ChatMessage = {
                role: 'assistant',
                content: chatResponse.response,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }

            this.sceneMessages.push(newMsg);
        },
        async streamSceneChat(request: SceneChatRequest) {
            try {
                this.isSceneChatAsyncing = true
                this.pushUserQuestion(request)
                this.tempAssistantMessage = ''
                this.sceneStreamingController = new AbortController()
                const response = await SceneChatService.streamSceneChat(
                    {
                        ...request,
                        chat_session_id: this.sceneCurrentSession[0]
                    },
                    (chunk) => {
                        if (chunk.error) {
                            message.error(chunk.error.message)
                            return
                        }

                        this.tempAssistantMessage += chunk.content
                    },
                    this.sceneStreamingController.signal
                )
            } catch (error) {
                message.error('chat request errer')
            } finally {
                this.isSceneChatAsyncing = false
                this.pushAssistantAnswer({
                    response: this.tempAssistantMessage,
                    chat_session_id: this.sceneCurrentSession[0]
                })
                this.sceneInputText = '';
                this.sceneStreamingController = null
                this.tempAssistantMessage = ''
            }
        },
        abortStreaming() {
            if (this.sceneStreamingController) {
                this.sceneStreamingController.abort();
            }
        },
    }
})