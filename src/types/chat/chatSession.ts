export interface BaseRequest {
    chat_session_id: string,
    user_id: string,
}

export interface ChatSessionResponse {
    sessionId: string
    sessionName: string
}

export interface ChatRequest extends BaseRequest {
    message: string,
    collection_name?: string,
    article_id?: string
}

export interface SummaryRequest extends BaseRequest {
    collection_name: string,
    article_id: string
}

export interface ChatResponse {
    response: string,
    chat_session_id: string,
}