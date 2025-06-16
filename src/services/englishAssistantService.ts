import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'
import type { EnglishWordAssistantRequest, TextLinguisticAssistantRequest } from '@/types/englishAssistant/englishAssistant'

import { streamClient } from '@/utils/apiUtils/streamApi'

export const EnglishAssistantService = {
    async streamEnglishWordAssistantService(request: EnglishWordAssistantRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<any>> {
        return streamClient.chat(request, 'EnglishAssistant/WordAssistan', onChunk, signal)
    },
    async streamWordTipsService(request: EnglishWordAssistantRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<any>> {
        return streamClient.chat(request, 'EnglishAssistant/WordTips', onChunk, signal)
    },
    async streamWordTranslateService(request: EnglishWordAssistantRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<any>> {
        return streamClient.chat(request, 'EnglishAssistant/WordTranslate', onChunk, signal)
    },
    async streamTextLinguisticAssistantService(request: TextLinguisticAssistantRequest, onChunk?: (chunk: StreamChunk) => void, signal?: AbortSignal): Promise<ApiResponse<any>> {
        return streamClient.chat(request, 'EnglishAssistant/TextLinguisticAssistant', onChunk, signal)
    },
}