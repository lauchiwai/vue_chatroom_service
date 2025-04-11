export interface ApiResponse<T> {
    isSuccess: boolean
    message: string | null
    data: T
}

export interface StreamChunk {
    content: string
    finished?: boolean
    error?: {
        code: number
        message: string
    }
}