import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'
import type { ChatSessionRequset, ChatSessionResponse, ChatResponse } from '@/types/chat/chat'
import type { SceneChatRequest } from '@/types/chat/sceneChat'

import { streamClient } from '@/utils/apiUtils/streamApi'
import { api } from '@/utils/apiUtils/api'

export const SceneChatService = {
    async generateSceneChatSession(request: ChatSessionRequset): Promise<ApiResponse<ChatSessionResponse>> {
        const response = await api.post<ApiResponse<ChatSessionResponse>>(`/Chat/GenerateChatSession`, request)
        return response.data;
    },
    async getSceneChatSessionList(): Promise<ApiResponse<ChatSessionResponse[]>> {
        const response = await api.get<ApiResponse<ChatSessionResponse[]>>(`/Chat/GetSceneChatSessionList`, {})
        return response.data;
    },
    async streamSceneChat(request: SceneChatRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<ChatResponse>> {
        return streamClient.chat(request, 'Chat/SceneChatStream', onChunk, signal)
    }
}