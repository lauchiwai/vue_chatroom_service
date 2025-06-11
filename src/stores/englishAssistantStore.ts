import type { EnglishWordAssistantRequest, TextLinguisticAssistantRequest } from '@/types/englishAssistant/englishAssistant'
import type { ChatMessage } from '@/types/chatHistory/chatHistory'

import { EnglishAssistantService } from '@/services/englishAssistantService'
import { defineStore } from 'pinia'

import { message } from 'ant-design-vue'
import dayjs from 'dayjs';

export const useEnglishAssistantStore = defineStore('englishAssistant', {
    state: () => ({
        text: '' as string,
        messages: [] as ChatMessage[],
        inputText: '' as string,
        streamingController: null as AbortController | null,
        tempAssistantMessage: '' as string,
        isChatAsyncing: false as boolean
    }),
    actions: {
        resetEnglishAssistantStore() {
            this.text = '';
            this.messages = [];
            this.inputText = '';
            this.streamingController = null;
            this.tempAssistantMessage = ''
            this.isChatAsyncing = false;
        },
        pushUserQuestion(question: string) {
            let newMsg: ChatMessage = {
                role: 'user',
                content: question,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }

            this.messages.push(newMsg);
        },
        pushAssistantAnswer(answer: string) {
            let newMsg: ChatMessage = {
                role: 'assistant',
                content: answer,
                timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }

            this.messages.push(newMsg);
        },
        async streamEnglishWordAssistant(request: EnglishWordAssistantRequest) {
            try {
                this.isChatAsyncing = true
                this.pushUserQuestion(request.message)
                this.tempAssistantMessage = ''
                this.streamingController = new AbortController()
                const response = await EnglishAssistantService.streamEnglishWordAssistantService(
                    {
                        ...request,
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
                this.pushAssistantAnswer(this.tempAssistantMessage)
                this.inputText = '';
                this.streamingController = null
                this.tempAssistantMessage = ''
            }
        },
        async streamEnglishTextLinguisticAssistant(request: TextLinguisticAssistantRequest) {
            try {
                this.isChatAsyncing = true
                this.pushUserQuestion(request.message)
                this.tempAssistantMessage = ''
                this.streamingController = new AbortController()
                const response = await EnglishAssistantService.streamTextLinguisticAssistantService(
                    {
                        ...request,
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
                this.pushAssistantAnswer(this.tempAssistantMessage)
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