<template>
    <div class="book-search-page">
        <header class="header" :class="{ 'header-hidden': !isHeaderVisible }">
            <div class="search-bar">
                <button @click="performSearch" class="search-btn">
                    <SearchOutlined />
                </button>
                <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="搜尋書籍..."
                    @keyup.enter="performSearch"
                    @focus="isFocused = true"
                    @blur="isFocused = false"
                    :class="{ 'input-focused': isFocused }"
                />
            </div>
        </header>

        <main class="content" ref="contentElement">
   

            <div v-if="filteredBooks.length" class="book-grid">
                <CardAddTrigger 
                    class="stats-item"
                    @click-event="handelAddEvent"
                />
                <BookCard  
                    @click-event="handelViewEvent"
                    v-for="article in articles" 
                    :key="article.articleId"
                    :article="article"
                    class="stats-item"
                />
            </div>
            <div v-else class="empty-state">
                <Empty />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import type { ArticleList } from '@/types/article/article'

import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useArticleStore } from '@/stores/articleStore'

import CardAddTrigger from '@/components/article/cardAddTrigger.vue'
import BookCard from '@/components/article/book/bookCard.vue';
import Empty from '@/components/common/empty.vue';

const router = useRouter()

const articleStore = useArticleStore()
const searchQuery = ref('');
const isHeaderVisible = ref(true);
const isFocused = ref(false);
const lastScrollPosition = ref(0);
const contentElement = ref<HTMLElement | null>(null);

const articles = ref<ArticleList[]> ([]);
const articleCount = ref(0);

onMounted(async () => {
    articles.value = await articleStore.getArticleList()
    articleCount.value = articles.value.length
    await nextTick()
})

const handelAddEvent = () => {
    router.push('BookShelf/Add')
}

const handelViewEvent = (article: ArticleList) => {
    router.push(`/BookShelf/View/${article.articleId}`)
}

const performSearch = () => {
    console.log('搜索:', searchQuery.value);
};

const filteredBooks = computed(() => {
    if (!searchQuery.value) return articles.value;
    const query = searchQuery.value.toLowerCase();
    return articles.value.filter(article => 
        article.articleTitle.toLowerCase().includes(query)
    );
});

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
});

onBeforeUnmount(() => {
    if (contentElement.value) {
        contentElement.value.removeEventListener('scroll', handleScroll);
    }
});
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

    .search-bar {
        display: flex;
        width: 100%;
        max-width: 600px;
        height: 56px;
        align-items: center;
        background: rgba(255, 255, 255, 0.92);
        border-radius: 28px;
        padding: 0 8px;
        transition: all 0.3s ease;
        box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.05),
            0 0 0 1px rgba(0, 0, 0, 0.04);

        &:hover {
            box-shadow: 
                0 6px 24px rgba(0, 0, 0, 0.08),
                0 0 0 1px rgba(0, 0, 0, 0.06);
        }

        input {
            flex: 1;
            padding: 0 16px;
            border: none;
            background: transparent;
            font-size: 1.1rem;
            outline: none;
            height: 100%;
            box-sizing: border-box;
            color: #222;
            font-weight: 500;
            transition: all 0.2s ease;

            &::placeholder {
                color: rgba(0, 0, 0, 0.4);
                font-weight: 400;
            }

            &.input-focused {
                &::placeholder {
                    color: rgba(0, 0, 0, 0.3);
                }
            }
        }

        .search-btn {
            width: 48px;
            height: 48px;
            display: flex;
            border: none;
            background-color: transparent;
            align-items: center;
            justify-content: center;
            color: rgba(0, 0, 0, 0.6);
            transition: all 0.2s ease;

            &:hover {
                color: #000;
            }

            :deep(svg) {
                font-size: 22px;
            }
        }
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
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 
        0 6px 16px rgba(0, 0, 0, 0.06),
        0 0 0 1px rgba(0, 0, 0, 0.04);
    
    &:hover {
        transform: translateY(-8px);
        box-shadow: 
            0 12px 24px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.05);
        background: #fcfcfc;
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
