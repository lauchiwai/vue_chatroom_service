import type { ApiResponse } from '@/types/api/apiResponse'
import type { ChatSessionResponse, ChatSessionRequset } from '@/types/chat/chat'
import { api } from '@/utils/apiUtils/api'

export const ChatService = {
    async generateChatSession(requset: ChatSessionRequset): Promise<ApiResponse<ChatSessionResponse>> {
        const response = await api.post<ApiResponse<ChatSessionResponse>>('/Chat/GenerateChatSession', requset)
        return response.data;
    },
    async getChatSessionList(): Promise<ApiResponse<ChatSessionResponse[]>> {
        const response = await api.get<ApiResponse<ChatSessionResponse[]>>('/Chat/GetChatSessionList', {})
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
}