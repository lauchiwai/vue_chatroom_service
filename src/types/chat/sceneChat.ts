import type { BasechatRequest } from '@/types/chat/chat'

export interface SceneChatRequest extends BasechatRequest {
    message: string,
}