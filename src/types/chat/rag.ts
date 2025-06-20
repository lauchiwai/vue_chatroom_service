import type { BasechatRequest } from '@/types/chat/chat'
interface RagData {
    collection_name: string,
    article_id: number
}

export interface RagChatRequest extends BasechatRequest, RagData {
    message: string,
}

export interface SummaryRequest extends BasechatRequest, RagData {
}