<template>
    <ReviewWordCard :item="wordItem" v-if="wordItem" />
</template>

<script lang="ts" setup>
import type { WordType } from '@/types/word/word'

import { useWordStore } from '@/stores/wordStore'
import { toSafeNumber } from '@/utils/common/toSafeNumber'
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

import ReviewWordCard from '@/components/word/wordCard/reviewWordCard.vue'
const route = useRoute()
const wordStore = useWordStore()

const wordItem = ref<WordType>()
const wordId = computed(() => {
    const id = route.params.id
    return toSafeNumber(id)
})

onMounted(async () => {
    await initWord()
    await nextTick()
})

const initWord = async () => {
    if (!wordId.value) {
        message.error("wordId is null")
        return 
    }
    
    try {
        const wordResponse= await wordStore.getWordById(wordId.value)
        wordItem.value = wordResponse ?? undefined
    } catch (error) {
        message.error("加载單字失败")
        console.error("initArticle error:", error)
    }
}
</script>

<style scoped lang="scss">
</style>