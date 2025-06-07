<template>
    <div class="book-container" @click="handelClick">
        <MyCard :show-border="true">
            <template #content>
                <BookItem :title="article.articleTitle" />
            </template>
        </MyCard>
    </div>
</template>

<script setup lang="ts">
import type { ArticleList } from '@/types/article/article';

import MyCard from '@/components/common/myCard.vue';
import BookItem from '@/components/article/bookItem.vue'


const emit = defineEmits(['click-event'])
const props = defineProps({
    article: {
        type: Object as () => ArticleList,
        required: true
    },
})

const handelClick = () => {
    emit('click-event', props.article)
}
</script>

<style scoped lang="scss">
.book-container {
    cursor: pointer;
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    
    transition: transform 0.3s, box-shadow 0.3s;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
    
    :deep(.my-card) {
        width: 100%;
        height: 100%;
        display: flex;
    }
}
</style>
