import type { ApiResponse } from '@/types/api/apiResponse'

import { ChatService } from '@/services/chatService'
import { defineStore } from 'pinia'

import { message } from 'ant-design-vue'

export const useChatStore = defineStore('chat', {
    state: () => ({
    }),
    actions: {
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
    }
})