import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'
import type { ChatSessionResponse } from '@/types/chat/chat'
import type { RagChatRequest, SummaryRequest } from '@/types/chat/rag'
import type { ChatResponse } from '@/types/chat/chat'

import { streamClient } from '@/utils/apiUtils/streamApi'
import { api } from '@/utils/apiUtils/api'

export const RagService = {
    async generateRagChatSession(articleId: number): Promise<ApiResponse<ChatSessionResponse>> {
        const response = await api.post<ApiResponse<ChatSessionResponse>>(`/Chat/GenerateRagChatSession/${articleId}`)
        return response.data;
    },
    async getRagChatSessionListByArticleId(articleId: number): Promise<ApiResponse<ChatSessionResponse[]>> {
        const response = await api.get<ApiResponse<ChatSessionResponse[]>>(`/Chat/GetRagChatSessionListByArticleId/${articleId}`, {})
        return response.data;
    },
    async streamChat(request: RagChatRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<ChatResponse>> {
        return streamClient.chat(request, 'Chat/ChatStream', onChunk, signal)
    },
    async streamSummaryChat(request: SummaryRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<ChatResponse>> {
        return streamClient.chat(request, 'Chat/SummaryStream', onChunk, signal)
    },
}