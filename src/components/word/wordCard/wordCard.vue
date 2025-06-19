<template>
    <div class="word-container" @click="handelClick">
        <MyCard :show-border="true">
            <template #content>
                <WordItem :word="word" />
            </template>
        </MyCard>
    </div>
</template>

<script setup lang="ts">
import type { WordType } from '@/types/word/word';

import MyCard from '@/components/common/myCard.vue';
import WordItem from '@/components/word/wordCard/wordItem.vue'

const emit = defineEmits(['click-event'])
const props = defineProps({
    word: {
        type: Object as () => WordType,
        required: true
    },
})

const handelClick = () => {
    emit('click-event', props.word)
}
</script>

<style scoped lang="scss">
.word-container {
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
