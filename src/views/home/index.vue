<template>
    <div class="article-container">
        <ArticleStatisticCard />
    </div>
    <div class="word-container">
        <WordStatisticCard />
    </div>
</template>

<script lang="ts"setup>
import ArticleStatisticCard from '@/components/home/articleStatisticCard.vue'
import WordStatisticCard from '@/components/home/wordStatisticCard.vue'
</script>

<style scoped lang="scss">
.article-container{
    padding: 4px;
}

.word-container{
    padding:10px
}
</style>