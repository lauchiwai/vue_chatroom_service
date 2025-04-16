import type { ApiResponse } from '@/types/api/apiResponse'
import type { ChatMessage, ChatHistory } from '@/types/chatHistory/chatHistory'
import { api } from '@/utils/api'

export const ChatHistoryService = {
    async getChatHistory(sessionId: string): Promise<ApiResponse<ChatHistory>> {
        const response = await api.get<ApiResponse<ChatHistory>>(`/Chat/GetChatHistory/${sessionId}`, {})
        return response.data;
    },
}