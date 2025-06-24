<template>
    <div class="word-search-page">
        <header class="header" :class="{ 'header-hidden': !isHeaderVisible }">
            <SearchBar 
                v-model="searchQuery"
                @search="performSearch"
                @clear="clearSearch"
                ref="searchBarRef"
            />
        </header>
        <main class="content" ref="contentElement">
            <div v-if="loading" class="loading-state">
                <a-spin size="large" />
            </div>
            <div v-else-if="wordList.length" class="word-grid">
                <WordCard  
                    @click-event="handelViewEvent"
                    v-for="word in wordList" 
                    :key="word.wordId"
                    :item="word"
                    class="word-item"
                />
            </div>
            <div v-else class="empty-state">
                <Empty>
                    <template #description>
                        <p v-if="searchQuery">沒有找到匹配 "{{ searchQuery }}" 的單字</p>
                        <p v-else>您還沒有添加任何單字</p>
                    </template>
                </Empty>
            </div>
            
            <div v-if="loadingMore" class="loading-more">
                <div class="loading-spinner"></div>
                <span>載入更多單字...</span>
            </div>
            
            <div v-if="noMoreData" class="no-more-data">
                <span>沒有更多單字了</span>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import type { WordType } from '@/types/word/word';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useWordStore } from '@/stores/wordStore';
import { ROUTE_NAMES } from '@/router';

import SearchBar from '@/components/article/searchBar/searchBar.vue';
import WordCard from '@/components/word/wordCard/wordCard.vue';
import Empty from '@/components/common/empty.vue';

const router = useRouter();
const wordStore = useWordStore();
const { pagination, wordList } = storeToRefs(wordStore);

const searchQuery = ref('');
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null);

const isHeaderVisible = ref(true);
const lastScrollPosition = ref(0);
const contentElement = ref<HTMLElement | null>(null);
const loading = ref(false);
const loadingMore = ref(false);

const noMoreData = computed(() => 
    pagination.value.pageNumber >= pagination.value.totalPages && 
    pagination.value.totalPages > 0
);

onMounted(async () => {
    await getWords();
    setupEventListeners();
});

const getWords = async () => {
    loading.value = true;
    try {
        await wordStore.getWordList(true);
    } finally {
        loading.value = false;
    }
};

const loadNextPage = async () => {
    if (loadingMore.value || noMoreData.value) return;
    
    loadingMore.value = true;
    try {
        const nextPage = pagination.value.pageNumber + 1;
        wordStore.setSearchParams({
            pageNumber: nextPage
        });
        
        await wordStore.getWordList(false);
    } catch (error) {
        console.error('載入下一頁失敗:', error);
    } finally {
        loadingMore.value = false;
    }
};

const performSearch = (query: string) => {
    searchQuery.value = query;
    wordStore.setSearchParams({
        keyword: query,
        pageNumber: 1
    });
    getWords();
};

const clearSearch = () => {
    searchQuery.value = '';
    wordStore.setSearchParams({
        keyword: '',
        pageNumber: 1
    });
    getWords();
};

const handelViewEvent = (word: WordType) => {
    router.push({ 
        name: ROUTE_NAMES.WORD_VIEW, 
        params: { id: word.wordId } 
    });
};

const handleScroll = () => {
    if (!contentElement.value) return;
    
    const currentScrollPosition = contentElement.value.scrollTop;
    
    if (currentScrollPosition <= 10) {
        isHeaderVisible.value = true;
        lastScrollPosition.value = currentScrollPosition;
        return;
    }
    
    const scrollingDown = currentScrollPosition > lastScrollPosition.value;
    
    if (scrollingDown && currentScrollPosition > 100) {
        isHeaderVisible.value = false;
    } else if (!scrollingDown) {
        isHeaderVisible.value = true;
    }
    
    lastScrollPosition.value = currentScrollPosition;
    
    const { scrollTop, scrollHeight, clientHeight } = contentElement.value;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
    
    if (distanceToBottom < 300 && !loadingMore.value && !noMoreData.value) {
        loadNextPage();
    }
};

const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        searchBarRef.value?.focus();
    }
};

const setupEventListeners = () => {
    if (contentElement.value) {
        contentElement.value.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('keydown', handleKeyPress);
};

onBeforeUnmount(() => {
    if (contentElement.value) {
        contentElement.value.removeEventListener('scroll', handleScroll);
    }
    window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped lang="scss">
.word-search-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
    overflow: hidden;
    color: #333;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 16px 24px;
    transform: translateY(0);
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 1;
    display: flex;
    justify-content: center;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.86);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

    &.header-hidden {
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
    }
}

.content {
    flex: 1;
    overflow-y: auto;
    box-sizing: border-box;
    transition: padding-top 0.3s ease;
    padding-bottom: 60px;

    @media (min-width: 768px) {
        padding: 32px;
    }
}

.word-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding-top: 16px;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
    }

    @media (max-width: 480px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
    }
}

.word-item {
    aspect-ratio: 1/1;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    overflow: hidden;
    &:hover {
        transform: translateY(-8px);
    }
}

.empty-state {
    height: calc(100vh - 160px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    color: rgba(0, 0, 0, 0.5);
    padding: 40px;
    font-size: 1.2rem;
}

.loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
}

.loading-more {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #666;
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: #3498db;
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 10px;
    }
    
    span {
        font-size: 0.9rem;
    }
}

.no-more-data {
    text-align: center;
    padding: 20px;
    color: #999;
    font-size: 0.9rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
