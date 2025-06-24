import type { ApiResponse } from '@/types/api/apiResponse'
import type { WordType, WordRequest } from '@/types/word/word'
import type { PagedViewModel, SearchParams } from '@/types/search/search'

import { wordService } from '@/services/wordService'
import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

export const useWordStore = defineStore('word', {
    state: () => ({
        wordList: [] as WordType[],
        wordCache: new Map<number, WordType>(),
        currentWord: null as WordType | null,
        searchParams: {
            pageNumber: 1,
            pageSize: 10,
            keyword: undefined,
            sortBy: undefined,
            sortDirection: 'asc',
            startDate: undefined,
            endDate: undefined
        } as SearchParams,
        pagination: {
            totalCount: 0,
            pageNumber: 1,
            pageSize: 10,
            totalPages: 1
        }
    }),
    actions: {
        setSearchParams(params: Partial<SearchParams>) {
            this.searchParams = {
                ...this.searchParams,
                ...params
            };
            if (params.keyword !== undefined || params.startDate !== undefined || params.endDate !== undefined) {
                this.searchParams.pageNumber = 1;
            }
        },

        reset() {
            this.wordList = [];
            this.pagination = {
                totalCount: 0,
                pageNumber: 1,
                pageSize: 10,
                totalPages: 1
            };
        },

        async getWordList(forceRefresh = false) {
            try {
                if (forceRefresh) {
                    this.reset()
                }

                const response: ApiResponse<PagedViewModel<WordType[]>> =
                    await wordService.getWordList(this.searchParams);

                if (!response.isSuccess) {
                    message.error("獲取單字列表錯誤: " + (response.message || "未知錯誤"));
                    return this.wordList;
                }
                this.wordList = [...this.wordList, ...response.data.items];
                this.pagination = {
                    totalCount: response.data.totalCount,
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalPages: response.data.totalPages
                };

                return this.wordList;
            } catch (error) {
                message.error('獲取單字列表失敗，請重試');
                console.error('getWordList error:', error);
                return this.wordList;
            }
        },

        async handlePageChange(pageNumber: number, pageSize: number) {
            this.setSearchParams({
                pageNumber,
                pageSize
            });
            await this.getWordList(true);
        },

        async getWordById(wordId: number, forceRefresh = false) {
            try {
                if (!forceRefresh && this.wordCache.has(wordId)) {
                    return this.wordCache.get(wordId);
                }

                const response = await wordService.getWordById(wordId);
                if (!response.isSuccess) {
                    message.error("獲取單字詳情錯誤: " + (response.message || "未知錯誤"));
                    return this.wordCache.get(wordId);
                }

                if (response.data) {
                    this.wordCache.set(wordId, response.data);
                }

                return response.data;
            } catch (error) {
                message.error('獲取單字詳情失敗，請重試');
                console.error('getWordById error:', error);
                return this.wordCache.get(wordId);
            }
        },

        async addWord(wordParams: WordRequest) {
            try {
                const response = await wordService.addWord(wordParams);
                if (response.isSuccess) {
                    message.success('單字添加成功！');
                    await this.getWordList(true);
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

        async updateWordReviewStatus(wordId: number) {
            try {
                const response = await wordService.updateWordReviewStatus(wordId);
                if (!response.isSuccess) {
                    message.error('更新復習進度失敗: ' + (response.message || "未知錯誤"));
                }
                return response.isSuccess;
            } catch (error) {
                message.error('更新復習進度時發生異常');
                console.error('updateWordReviewStatus error:', error);
                return null;
            }
        },

        async removeWordById(wordId: number) {
            try {
                const response = await wordService.removeWordById(wordId);
                if (response.isSuccess) {
                    message.success('單字刪除成功！');

                    this.wordList = this.wordList.filter(word => word.wordId !== wordId);
                    this.wordCache.delete(wordId);

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
                    await this.getWordList(true);
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
                    message.error("檢查單字存在狀態錯誤: " + (response.message || "未知錯誤"));
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
            await this.getWordList(true);
        },

        async fetchNextReviewWord() {
            try {
                const response = await wordService.getNextReviewWord();
                if (!response.isSuccess) {
                    message.error("獲取下一個複習單字錯誤: " + (response.message || "未知錯誤"));
                    return null;
                }
                return response.data;
            } catch (error) {
                message.error('獲取下一個複習單字失敗，請重試');
                console.error('fetchNextReviewWord error:', error);
                return null;
            }
        },

        async fetchReviewWordCount() {
            try {
                const response = await wordService.getReviewWordCount();
                if (!response.isSuccess) {
                    message.error("獲取複習單字數量錯誤: " + (response.message || "未知錯誤"));
                    return 0;
                }
                return response.data;
            } catch (error) {
                message.error('獲取複習單字數量失敗，請重試');
                console.error('fetchReviewWordCount error:', error);
                return 0;
            }
        },

        async performSearch(keyword: string) {
            this.setSearchParams({ keyword });
            await this.getWordList(true);
        },

        clearCache() {
            this.wordList = [];
            this.wordCache.clear();
        }
    }
})
