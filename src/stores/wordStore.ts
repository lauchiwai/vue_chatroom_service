import type { ApiResponse } from '@/types/api/apiResponse'
import type { WordType, WordRequest } from '@/types/word/word'

import { wordService } from '@/services/wordService'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

export const useWordStore = defineStore('word', {
    state: () => ({
        wordList: [] as WordType[],
        currentWord: null as WordType | null,
    }),
    actions: {
        async getWordList() {
            try {
                const response: ApiResponse<WordType[]> = await wordService.getWordList()
                if (!response.isSuccess) {
                    message.error("獲取單字列表錯誤: " + (response.message || "未知錯誤"))
                    return []
                }

                this.wordList = response.data || [];
                return this.wordList;
            } catch (error) {
                message.error('獲取單字列表失敗，請重試')
                console.error('getWordList error:', error)
                return []
            }
        },

        async addWord(wordParams: WordRequest) {
            try {
                const response = await wordService.addWord(wordParams);
                if (response.isSuccess) {
                    message.success('單字添加成功！');
                    return response.data;
                } else {
                    message.error('添加單字失敗: ' + (response.message || "未知錯誤"));
                    return null;
                }
            } catch (error) {
                message.error('添加單字時發生異常');
                console.error('addWord error:', error);
                return null;
            }
        },

        async getWordById(wordId: number) {
            try {
                if (this.currentWord?.wordId === wordId) {
                    return this.currentWord;
                }

                const response = await wordService.getWordById(wordId);
                if (!response.isSuccess) {
                    message.error("獲取單字詳情錯誤: " + (response.message || "未知錯誤"))
                    return null;
                }

                this.currentWord = response.data;
                return this.currentWord;
            } catch (error) {
                message.error('獲取單字詳情失敗，請重試');
                console.error('getWordById error:', error);
                return null;
            }
        },

        async removeWordById(wordId: number) {
            try {
                const response = await wordService.removeWordById(wordId);
                if (response.isSuccess) {
                    message.success('單字刪除成功！');

                    this.wordList = this.wordList.filter(word => word.wordId !== wordId);
                    if (this.currentWord?.wordId === wordId) {
                        this.currentWord = null;
                    }

                    return true;
                } else {
                    message.error('刪除單字失敗: ' + (response.message || "未知錯誤"));
                    return false;
                }
            } catch (error) {
                message.error('刪除單字時發生異常');
                console.error('removeWord error:', error);
                return false;
            }
        },

        async removeWordByText(word: string) {
            try {
                const response = await wordService.removeWordByText(word);
                if (response.isSuccess) {
                    message.success('單字刪除成功！');
                    return true;
                } else {
                    message.error('刪除單字失敗: ' + (response.message || "未知錯誤"));
                    return false;
                }
            } catch (error) {
                message.error('刪除單字時發生異常');
                console.error('removeWord error:', error);
                return false;
            }
        },

        async checkUserWordExistsById(wordId: number) {
            try {
                const response = await wordService.checkUserWordExistsById(wordId);
                if (!response.isSuccess) {
                    message.error("檢查單字存在狀態錯誤: " + (response.message || "未知錯誤"))
                    return false;
                }
                return response.data;
            } catch (error) {
                message.error('檢查單字存在狀態失敗');
                console.error('checkUserWordExists error:', error);
                return false;
            }
        },

        async checkWordExistsByText(text: string) {
            try {
                const response = await wordService.checkUserWordExistsByText(text);
                if (!response.isSuccess) {
                    return false;
                }

                return response.data;
            } catch (error) {
                console.error('checkWordExistsByText error:', error);
                return false;
            }
        },

        async refreshWordList() {
            this.wordList = [];
            return await this.getWordList();
        }
    }
})
