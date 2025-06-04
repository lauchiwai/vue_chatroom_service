import type { ApiResponse, StreamChunk } from '@/types/api/apiResponse'

import { handleUnauthorized } from '@/utils/authApi'
import { useUserStore } from '@/stores/authStore'

interface StreamClientConfig {
    baseURL?: string
}

export class StreamClient {
    private config: Required<StreamClientConfig>

    constructor(config: StreamClientConfig = {}) {
        this.config = {
            baseURL: config.baseURL || import.meta.env.VITE_API_URL || 'unknow',
            ...config
        }
    }

    async chat(
        request: any,
        uri: string,
        onChunk?: (chunk: StreamChunk) => void,
        signal?: AbortSignal
    ): Promise<ApiResponse<any>> {
        let retryCount = 0
        const maxRetries = 1

        const executeRequest = async (): Promise<ApiResponse<any>> => {
            const controller = new AbortController()
            const effectiveSignal = signal || controller.signal

            let content = ''

            try {
                const response = await fetch(`${this.config.baseURL}${uri}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getToken()}`
                    },
                    body: JSON.stringify(request),
                    signal: effectiveSignal
                })

                if (response.status === 401 && retryCount < maxRetries) {
                    retryCount++
                    const refreshSuccess = await handleUnauthorized()

                    if (refreshSuccess) {
                        return executeRequest()
                    }
                }

                if (!response.ok) {
                    return this.formatError('request error', response.status)
                }

                const reader = response.body?.getReader()
                if (!reader) return this.formatError('empty steam data')

                return this.processStream(reader, content, onChunk, request.chat_session_id)
            } catch (error) {
                return this.handleError(error, request.chat_session_id)
            }
        }

        return executeRequest()
    }

    private getToken() {
        const userStore = useUserStore()
        return userStore.accessToken ?? "unkonow"
    }

    private async processStream(
        reader: ReadableStreamDefaultReader,
        content: string,
        onChunk?: (chunk: StreamChunk) => void,
        sessionId?: string
    ): Promise<ApiResponse<any>> {
        const decoder = new TextDecoder()

        try {
            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunkStr = decoder.decode(value)
                const lines = chunkStr.split('\n\n').filter(l => l.startsWith('data: '))

                for (const line of lines) {
                    const chunk = this.parseChunk(line.replace('data: ', ''))
                    content += chunk.content
                    onChunk?.(chunk)

                    if (chunk.error) {
                        return this.formatError(chunk.error.message, chunk.error.code, sessionId)
                    }
                }
            }

            return {
                isSuccess: true,
                message: null,
                data: { response: content, chat_session_id: sessionId || '' }
            }
        } catch (error) {
            return this.handleError(error, sessionId)
        }
    }

    private parseChunk(data: string): StreamChunk {
        try {
            return JSON.parse(data)
        } catch {
            return { content: '', error: { code: 500, message: 'stream data parse error' } }
        }
    }

    private formatError(
        message: string,
        code?: number,
        sessionId?: string
    ): ApiResponse<any> {
        return {
            isSuccess: false,
            message: code ? `[${code}] ${message}` : message,
            data: { response: '', chat_session_id: sessionId || '' }
        }
    }

    private handleError(error: unknown, sessionId?: string): ApiResponse<any> {
        const message = error instanceof Error ? error.message : 'unkonow error'
        return this.formatError(message, undefined, sessionId)
    }
}

export const streamClient = new StreamClient({
    baseURL: import.meta.env.VITE_API_BASE_URL
})