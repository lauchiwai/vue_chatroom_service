import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'
import type { ChatSessionResponse, ChatRequest, ChatResponse } from '@/types/chat/chatSession'

import { streamClient } from '@/utils/streamApi'
import { api } from '@/utils/api'

export const ChatService = {
    async generateChatSession(userTimeZoneId: string = "Asia/Hong_Kong"): Promise<ApiResponse<ChatSessionResponse>> {
        const response = await api.post<ApiResponse<ChatSessionResponse>>('/Chat/GenerateChatSession', {
            userTimeZoneId,
        })
        return response.data;
    },
    async getChatSessionList(): Promise<ApiResponse<ChatSessionResponse[]>> {
        const response = await api.get<ApiResponse<ChatSessionResponse[]>>('/Chat/GetChatSessionList', {})
        return response.data;
    },
    async deleteChatData(sessionId: string): Promise<ApiResponse<object>> {
        const response = await api.delete<ApiResponse<object>>(`/Chat/DeleteChatData/${sessionId}`, {})
        return response.data;
    },
    async refreshChatSessionTime(sessionId: string): Promise<ApiResponse<object>> {
        const response = await api.post<ApiResponse<object>>(`/Chat/RefreshChatSessionTime/?sessionId=${sessionId}`, {})
        return response.data;
    },
    async streamChat(request: ChatRequest, onChunk?: (chunk: StreamChunk) => void): Promise<ApiResponse<ChatResponse>> {
        return streamClient.chat(request, 'Chat/ChatStream', onChunk)
    }
}