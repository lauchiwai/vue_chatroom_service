import type { ApiResponse } from '@/types/api/apiResponse'
import type { ChatMessage, ChatHistory } from '@/types/chatHistory/chatHistory'
import { api } from '@/services/api'

export const ChatHistoryService = {
    async getChatHistoryBySessionId(sessionId: string): Promise<ApiResponse<ChatHistory>> {
        const response = await api.get<ApiResponse<ChatHistory>>(`/ChatSession/GetChatHistoryBySessionId/${sessionId}`, {})
        return response.data;
    },
}