export interface ApiResponse<T> {
    isSuccess: boolean
    message: string
    data: T
    code: number
}

export interface StreamChunk {
    content: string
    finished?: boolean
    error?: {
        code: number
        message: string
    }
}