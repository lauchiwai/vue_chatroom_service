import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'
import type { ChatSessionResponse, ChatRequest, ChatResponse, SummaryRequest } from '@/types/chat/chat'

import { streamClient } from '@/utils/apiUtils/streamApi'
import { api } from '@/utils/apiUtils/api'

export const ChatService = {
    async generateChatSession(): Promise<ApiResponse<ChatSessionResponse>> {
        const response = await api.post<ApiResponse<ChatSessionResponse>>('/Chat/GenerateChatSession')
        return response.data;
    },
    async generateRagChatSession(articleId: number): Promise<ApiResponse<ChatSessionResponse>> {
        const response = await api.post<ApiResponse<ChatSessionResponse>>(`/Chat/GenerateRagChatSession/${articleId}`)
        return response.data;
    },
    async getChatSessionList(): Promise<ApiResponse<ChatSessionResponse[]>> {
        const response = await api.get<ApiResponse<ChatSessionResponse[]>>('/Chat/GetChatSessionList', {})
        return response.data;
    },
    async getRagChatSessionListByArticleId(articleId: number): Promise<ApiResponse<ChatSessionResponse[]>> {
        const response = await api.get<ApiResponse<ChatSessionResponse[]>>(`/Chat/GetRagChatSessionListByArticleId/${articleId}`, {})
        return response.data;
    },
    async deleteChatData(sessionId: number): Promise<ApiResponse<object>> {
        const response = await api.delete<ApiResponse<object>>(`/Chat/DeleteChatData/${sessionId}`, {})
        return response.data;
    },
    async refreshChatSessionTime(sessionId: number): Promise<ApiResponse<object>> {
        const response = await api.post<ApiResponse<object>>(`/Chat/RefreshChatSessionTime/?sessionId=${sessionId}`, {})
        return response.data;
    },
    async streamChat(request: ChatRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<ChatResponse>> {
        return streamClient.chat(request, 'Chat/ChatStream', onChunk, signal)
    },
    async streamSummaryChat(request: SummaryRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<ChatResponse>> {
        return streamClient.chat(request, 'Chat/SummaryStream', onChunk, signal)
    }
}