<template>
    <div class="article-reader-container center-box">
        <div class="article-reader-wrapper">
            <ArticleReader 
                :page-char-count="700"
                :content="article?.articleContent ?? ''"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Article } from '@/types/article/article'

import { useArticleStore } from '@/stores/articleStore'
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'

import ArticleReader from '@/components/article/articleReader.vue'

const route = useRoute()
const articleStore = useArticleStore();

const article = ref<Article> ();
const articleId = computed(() => {
    const id = route.params.id
    return Array.isArray(id) ? id[0] : id || ''
})

onMounted(async () => {
    article.value = await articleStore.getArticleById(articleId.value);
    await nextTick()
})
</script>

<style scoped lang="scss">
.center-box {
    display: flex;
    align-items: center;
    justify-content: center;
}

.article-reader-container {
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    padding: 6px;

    .article-reader-wrapper {
        width: 100%;
        display: flex;
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        padding: 20px;
        box-sizing: border-box;
        background-color: #f9f9f9;
        
        &::-webkit-scrollbar {
            width: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }
    }
}

@media (max-width: 768px) {
    .article-reader-container{
        border-radius: 0;
    }
}
</style>
