export interface ChatSessionRequset {
    chat_session_name?: string
}

export interface ChatSessionResponse {
    sessionId: number
    sessionName: number
}

export interface BasechatRequest {
    chat_session_id: number,
}

export interface ChatResponse {
    response: string,
    chat_session_id: number,
}