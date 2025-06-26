<template>
    <ReviewWordCard 
        :item="wordItem" 
        v-if="wordItem" 
        :key="componentKey"
    />
</template>

<script lang="ts" setup>
import type { WordType } from '@/types/word/word'
import { useWordStore } from '@/stores/wordStore'
import { toSafeNumber } from '@/utils/common/toSafeNumber'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

import ReviewWordCard from '@/components/word/wordCard/reviewWordCard.vue'

const route = useRoute()
const wordStore = useWordStore()
const componentKey = ref(0)
const wordItem = ref<WordType>()
const wordId = ref(toSafeNumber(route.params.id))

watch(
    () => route.params.id,
    async (newId) => {
        wordId.value = toSafeNumber(newId)
        await fetchWordData()
        componentKey.value += 1
    }
)

onMounted(async () => {
    await fetchWordData()
})

const fetchWordData = async () => {
    if (!wordId.value) {
        message.error("wordId is null")
        return 
    }
    
    try {
        const wordResponse = await wordStore.getWordById(wordId.value)
        wordItem.value = wordResponse ?? undefined
    } catch (error) {
        message.error("加载單字失败")
        console.error("fetchWordData error:", error)
    }
}
</script>
