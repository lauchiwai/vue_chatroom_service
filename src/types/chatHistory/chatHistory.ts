export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface ChatHistory {
    response: ChatMessage[];
    chat_session_id: string;
}