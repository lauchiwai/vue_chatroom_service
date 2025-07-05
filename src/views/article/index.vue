<template>
    <SearchContainer 
        :initial-query="searchQuery"
        @scroll-bottom="handleScrollBottom"
        ref="searchContainerRef"
        :freeze-header="loadingMore || isScrolling"
    >
        <template #search-bar>
            <div class="header">
                <SearchBar 
                    v-model="searchQuery"
                    @search="performSearch"
                    ref="searchBarRef"
                />
            </div>
        </template>
        
        <template #default>
            <div v-if="articleList.length" class="book-grid">
                <AddTrigger class="stats-item" />
                <BookCard  
                    @click-event="handelViewEvent"
                    v-for="article in articleList" 
                    :key="article.articleId"
                    :article="article"
                    class="stats-item"
                />
            </div>
            <div v-else class="empty-state">
                <Empty v-if="!loading">
                    <template #action>
                        <EmptyStateActions 
                            :handle-refresh="handleRefresh"
                        />
                    </template>
                </Empty>
            </div>
            
            <div v-if="loadingMore" class="loading-more">
                <div class="loading-spinner"></div>
                <span>載入更多文章...</span>
            </div>
            
            <div v-if="noMoreData" class="no-more-data">
                <span>沒有更多文章了</span>
            </div>
        </template>
    </SearchContainer>
</template>

<script setup lang="ts">
import type { ArticleList } from '@/types/article/article';
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useArticleStore } from '@/stores/articleStore';
import { ROUTE_NAMES } from '@/router';

import SearchContainer from '@/components/common/searchBar/searchComponent.vue';
import SearchBar from '@/components/common/searchBar/searchBar.vue';
import BookCard from '@/components/article/book/bookCard.vue';
import Empty from '@/components/common/empty.vue';
import AddTrigger from '@/components/article/buttons/addTrigger.vue';
import EmptyStateActions from '@/components/article/buttons/emptyStateActions.vue';

const router = useRouter();
const articleStore = useArticleStore();
const { pagination, articleList } = storeToRefs(articleStore);

const searchQuery = ref('');
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null);
const searchContainerRef = ref<InstanceType<typeof SearchContainer> | null>(null);

const loading = ref(false);
const loadingMore = ref(false);
const isScrolling = ref(false);
const scrollBottomDebounce = ref(0);

const noMoreData = computed(() => 
    pagination.value.pageNumber >= pagination.value.totalPages && 
    pagination.value.totalPages > 0
);

onMounted(async () => {
    articleStore.resetData();
    articleStore.resetSearchParams();
    await getArticle();
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyPress);
});

const getArticle = async () => {
    loading.value = true;
    try {
        await articleStore.getArticleList();
    } catch (error) {
        console.error('取得文章列表失敗:', error);
    } finally {
        loading.value = false;
    }
};

const handleScrollBottom = () => {
    if (scrollBottomDebounce.value) {
        cancelAnimationFrame(scrollBottomDebounce.value);
    }
    
    scrollBottomDebounce.value = requestAnimationFrame(() => {
        if (!loadingMore.value && !noMoreData.value) {
            loadNextPage();
        }
    });
};

const loadNextPage = async () => {
    if (loadingMore.value || noMoreData.value) return;
    
    loadingMore.value = true;
    isScrolling.value = true;
    
    try {
        const nextPage = pagination.value.pageNumber + 1;
        articleStore.setSearchParams({ pageNumber: nextPage });
        await articleStore.getArticleList();
        
        await nextTick();
    } catch (error) {
        console.error('載入下一頁失敗:', error);
    } finally {
        setTimeout(() => {
            loadingMore.value = false;
            isScrolling.value = false;
        }, 500);
    }
};

const handleRefresh = () => {
    articleStore.resetSearchParams();
    searchQuery.value = '';
    getArticle();
};

const performSearch = () => {
    articleStore.resetSearchParams();
    articleStore.resetData();
    articleStore.setSearchParams({ keyword: searchQuery.value });
    getArticle();
};

const handelViewEvent = (article: ArticleList) => {
    router.push({ 
        name: ROUTE_NAMES.BOOKSHELF_VIEW, 
        params: { id: article.articleId } 
    });
};

const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        searchBarRef.value?.focus();
    }
};

window.addEventListener('keydown', handleKeyPress);
</script>

<style scoped lang="scss">
.header {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 16px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.86);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    transition: none !important;
}

.book-grid {
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

.stats-item {
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
