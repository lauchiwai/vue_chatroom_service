import type { ApiResponse } from '@/types/api/apiResponse'
import type { WordType, WordRequest } from '@/types/word/word'

import { api } from '@/utils/apiUtils/api'

export const wordService = {
    async addWord(request: WordRequest): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/Word/AddWord', request)
        return response.data
    },

    async getWordList(): Promise<ApiResponse<WordType[]>> {
        const response = await api.get<ApiResponse<WordType[]>>('/Word/GetWordList')
        return response.data
    },

    async getWordById(wordId: number): Promise<ApiResponse<WordType>> {
        const response = await api.get<ApiResponse<WordType>>(`/Word/GetWordById/${wordId}`)
        return response.data
    },

    async removeWordById(wordId: number): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/Word/RemoveWordById/${wordId}`)
        return response.data
    },

    async removeWordByText(word: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/Word/RemoveWordByText/${word}`)
        return response.data
    },

    async checkUserWordExistsById(wordId: number): Promise<ApiResponse<boolean>> {
        const response = await api.get<ApiResponse<boolean>>(`/Word/CheckUserWordExistsById/${wordId}`)
        return response.data
    },

    async checkUserWordExistsByText(word: string): Promise<ApiResponse<boolean>> {
        const response = await api.get<ApiResponse<boolean>>(`/Word/CheckUserWordExistsByText/${word}`)
        return response.data
    }
}
