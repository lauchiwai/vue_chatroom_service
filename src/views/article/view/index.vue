<template>
    <div class="article-reader-container center-box">
        <div class="article-reader-wrapper">
            <ArticleReader 
                :content="article?.articleContent ?? ''"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Article } from '@/types/article/article'

import { useArticleStore } from '@/stores/articleStore'
import { toSafeNumber } from '@/utils/common/toSafeNumber'
import { ref, onMounted, nextTick, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import { ArticleIdKey } from '@/constants/injectionKeys'
import { message } from 'ant-design-vue'

import ArticleReader from '@/components/article/articleReader.vue'

const route = useRoute()
const articleStore = useArticleStore();

const article = ref<Article> ();
const articleId = computed(() => {
    const id = route.params.id
    return toSafeNumber(id)
})

onMounted(async () => {
    await initArticle();
    await nextTick()
})

const initArticle = async () =>{
    if(!articleId.value){
        message.error("articleId is null")
        return 
    }
    else 
        article.value = await articleStore.getArticleById(articleId.value);
}

provide(ArticleIdKey, articleId)
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

        .article-reader-wrapper{
            padding: 4px;
        }
    }
}
</style>
