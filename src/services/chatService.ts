import type { ApiResponse } from '@/types/api/apiResponse'
import type { ChatSessionResponse, ChatRequest, ChatResponse } from '@/types/chat/chatSession'
import type { ChatMessage, ChatHistory } from '@/types/chatHistory/chatHistory'
import { api } from '@/services/api'

export const ChatService = {
    async generateChatSession(userTimeZoneId: string = "Asia/Hong_Kong"): Promise<ApiResponse<ChatSessionResponse>> {
        const response = await api.post<ApiResponse<ChatSessionResponse>>('/ChatSession/GenerateChatSession', {
            userTimeZoneId,
        })
        return response.data;
    },
    async getChatSessionList(): Promise<ApiResponse<ChatSessionResponse[]>> {
        const response = await api.get<ApiResponse<ChatSessionResponse[]>>('/ChatSession/GetChatSessionList', {})
        return response.data;
    },
    async deleteChatData(sessionId: string): Promise<ApiResponse<ChatSessionResponse>> {
        const response = await api.delete<ApiResponse<ChatSessionResponse>>(`/ChatSession/DeleteChatData/${sessionId}`, {})
        return response.data;
    },
    async chat(chatRequest: ChatRequest): Promise<ApiResponse<ChatResponse>> {
        const response = await api.post<ApiResponse<ChatResponse>>('/ChatSession/Chat', chatRequest)
        return response.data;
    },
}