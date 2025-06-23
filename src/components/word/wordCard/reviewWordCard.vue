<template>
    <div class="background">
        <div class="glass-container">
            <h1 class="word-display">{{ item.word }}</h1>
        </div>

        <a-button 
            class="next-word-button" 
            @click="handleBntEvent"
        >
            <span>NEXT</span>
        </a-button>

        <FunctionFloatingButton :selected-text="item.word"/>
    </div>
</template>

<script setup lang="ts">
import type { WordType } from '@/types/word/word'
import { useRouter } from 'vue-router'
import { useWordStore } from '@/stores/wordStore';
import { ROUTE_NAMES } from '@/router'
import { ref, watch } from 'vue'

import FunctionFloatingButton from '@/components/word/floatingButtons/functionFloatingButton.vue'

const router = useRouter()
const wordStore = useWordStore()
const props = defineProps({
    item: {
        type: Object as () => WordType,
        required: true
    }
})

watch(
  () => props.item,
  (newItem) => {
    console.log('单词已更新:', newItem.word)
  },
  { immediate: true }
)

const handleBntEvent = async() =>{
    let isSuccess =  await wordStore.updateWordReviewStatus(props.item.wordId)
    if (isSuccess){
        let newWord: WordType | null = await wordStore.fetchNextReviewWord()
        if (newWord){
            handelViewEvent(newWord)
        }
    }
}

const handelViewEvent = (word: WordType) => {
    router.push({ 
        name: ROUTE_NAMES.WORD_VIEW, 
        params: { id: word.wordId },
        query: { t: Date.now() }
    })
}
</script>

<style scoped lang="scss">
.next-word-button {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 56px;
    background: gray;
    color: white;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 3;
    transition: all 0.3s ease;
  
    &:hover {
        transform: translateX(-50%) scale(1.05);
        color: antiquewhite;
    }
  
    &:active {
        transform: translateX(-50%) scale(0.95);
    }
  
    :deep(.ant-btn) {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .next-word-button {
        width: 80px;
        height: 48px;
        bottom: 15%;
      
        :deep(.ant-btn .anticon) {
            font-size: 20px;
        }
    }
}

@media (max-width: 576px) {
    .next-word-button {
        width: 70px;
        height: 42px;
        bottom: 12%;
      
        :deep(.ant-btn .anticon) {
            font-size: 18px;
        }
    }
}

.background {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(75, 108, 183, 0.1) 0%, rgba(24, 40, 72, 0.1) 100%);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  
    &::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.02) 70%
        );
        animation: rotate 30s linear infinite;
        z-index: 1;
    }
}

.glass-container {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.15),
        inset 0 0 8px rgba(255, 255, 255, 0.15);
    z-index: 2;
    padding: 16px 20px;
    max-width: 70vw;
    box-sizing: border-box;
    min-width: min-content;
}

.word-display {
    font-size: 2rem;
    font-weight: 700;
    color: gray;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 
        0 2px 6px rgba(0, 0, 0, 0.4),
        0 0 10px rgba(0, 0, 0, 0.15);
    margin: 0;
    font-family: 'Segoe UI', system-ui, sans-serif;
    line-height: 1.4;
    text-align: center;
    white-space: nowrap;
}

@media (max-width: 70vw) {
    .word-display {
        white-space: normal;
        word-break: break-word;
    }
}

@media (max-width: 768px) {
    .glass-container {
        padding: 14px 16px;
    }
  
    .word-display {
        font-size: 1.8rem;
    }
}

@media (max-width: 576px) {
    .glass-container {
        padding: 12px 14px;
        max-width: 90vw;
    }
  
    .word-display {
        font-size: 1.6rem;
        white-space: normal;
        word-break: break-word;
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
