export interface ChatSessionResponse {
    sessionId: string
    sessionName: string
}

export interface ChatRequest {
    chat_session_id: string,
    user_id: string,
    message: string,
    collection_name?: string
}

export interface ChatResponse {
    response: string,
    chat_session_id: string,
}