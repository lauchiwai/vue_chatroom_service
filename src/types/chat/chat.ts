export interface BaseRequest {
    chat_session_id: number,
    user_id: number,
}

export interface ChatSessionResponse {
    sessionId: number
    sessionName: number
}

export interface ChatRequest extends BaseRequest {
    message: string,
    collection_name?: string,
    article_id?: number
}

export interface SummaryRequest extends BaseRequest {
    collection_name: string,
    article_id: number
}

export interface ChatResponse {
    response: string,
    chat_session_id: number,
}