<template>
    <div class="book-search-page">
        <header class="header" :class="{ 'header-hidden': !isHeaderVisible }">
            <SearchBar 
                v-model="searchQuery"
                @search="performSearch"
                ref="searchBarRef"
            />
        </header>

        <main class="content" ref="contentElement">
            <div v-if="articles.length" class="book-grid">
                <AddTrigger class="stats-item" />

                <BookCard  
                    @click-event="handelViewEvent"
                    v-for="article in articles" 
                    :key="article.articleId"
                    :article="article"
                    class="stats-item"
                />
            </div>
            <div v-else class="empty-state">
                <Empty v-if="!loading"/>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import type { ArticleList } from '@/types/article/article';

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useArticleStore } from '@/stores/articleStore';
import { ROUTE_NAMES } from '@/router';

import SearchBar from '@/components/article/searchBar/searchBar.vue';

import BookCard from '@/components/article/book/bookCard.vue';
import Empty from '@/components/common/empty.vue';
import AddTrigger from '@/components/article/buttons/addTrigger.vue';


const router = useRouter();
const articleStore = useArticleStore();

const searchQuery = ref('');
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null);

const isHeaderVisible = ref(true);
const lastScrollPosition = ref(0);
const contentElement = ref<HTMLElement | null>(null);
const loading = ref(false);

const articles = ref<ArticleList[]>([]);
const articleCount = ref(0);

onMounted(async () => {
    await getArticle();
});

const getArticle = async () => {
    loading.value = true;
    try {
        articles.value = await articleStore.getArticleList();
        articleCount.value = articles.value.length;
    } catch (error) {
        console.error('獲取文章列表失敗:', error);
    } finally {
        loading.value = false;
    }
};

const performSearch = () => {

};

const handelViewEvent = (article: ArticleList) => {
    router.push({ 
        name: ROUTE_NAMES.BOOKSHELF_VIEW, 
        params: { id: article.articleId } 
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
};

onMounted(() => {
    if (contentElement.value) {
        contentElement.value.addEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
    if (contentElement.value) {
        contentElement.value.removeEventListener('scroll', handleScroll);
    }
    
    window.removeEventListener('keydown', handleKeyPress);
});

const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        searchBarRef.value?.focus();
    }
};
</script>

<style scoped lang="scss">
.book-search-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
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
    padding: 24px;
    overflow-y: auto;
    box-sizing: border-box;
    transition: padding-top 0.3s ease;

    @media (min-width: 768px) {
        padding: 32px;
    }
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
</style>
