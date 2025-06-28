<template>
    <div class="background">
        <div class="glass-container">
            <h1 class="word-display">{{ item.word }}</h1>
        </div>

        <div class="button-group">
            <a-button 
                class="action-button complete-button"
                @click="handleComplete"
            >
                <span>reviewed</span>
            </a-button>
            
            <a-button 
                class="action-button next-button"
                @click="handleNext"
            >
                <span>next</span>
            </a-button>
        </div>

        <FunctionFloatingButton :selected-text="item.word"/>
    </div>
</template>

<script setup lang="ts">
import type { WordType } from '@/types/word/word'
import { useRouter } from 'vue-router'
import { useWordStore } from '@/stores/wordStore';
import { ROUTE_NAMES } from '@/router'

import FunctionFloatingButton from '@/components/word/floatingButtons/functionFloatingButton.vue'
import { message } from 'ant-design-vue';

const router = useRouter()
const wordStore = useWordStore()
const props = defineProps({
    item: {
        type: Object as () => WordType,
        required: true
    }
})

const handleComplete = async () => {
    const newWord = await wordStore.fetchNextReviewWord(props.item.wordId)
    const isSuccess = await wordStore.updateWordReviewStatus(props.item.wordId)
    if(isSuccess) {
        message.success("復習完成")
        handleNewWord(newWord)
    } else {
        message.success("復習失敗, 請稍後再嘗試")
    }
}

const handleNext = async () => {
    const newWord = await wordStore.fetchNextReviewWord(props.item.wordId)
    handleNewWord(newWord)
}

const handleNewWord= (newWord :  WordType | null) => {
    if (newWord) 
        handelViewEvent(newWord)
    else 
        message.info("已經沒有單字了")
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
.button-group {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 24px;
    z-index: 3;
}

.action-button {
    min-width: 140px;
    height: 56px;
    border-radius: 28px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    letter-spacing: 0.5px;
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    &:active {
        transform: translateY(1px);
    }
}

.complete-button {
    background: linear-gradient(135deg, rgba(46, 204, 113, 0.7) 0%, rgba(39, 174, 96, 0.7) 100%);
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.next-button {
    background: linear-gradient(135deg, rgba(52, 152, 219, 0.7) 0%, rgba(41, 128, 185, 0.7) 100%);
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
    .button-group {
        bottom: 15%;
        gap: 16px;
    }
    
    .action-button {
        min-width: 120px;
        height: 48px;
        font-size: 0.9rem;
    }
}

@media (max-width: 576px) {
    .button-group {
        flex-direction: column;
        gap: 12px;
        bottom: 12%;
    }
    
    .action-button {
        min-width: 160px;
        height: 44px;
        font-size: 0.85rem;
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  
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
    position: relative;
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
    padding: 20px 24px;
    max-width: min(600px, 90vw);
    box-sizing: border-box;
    width: auto;
    margin-top: 10vh;

    @supports not (backdrop-filter: blur(8px)) {
        background: rgba(255, 255, 255, 0.5);
    }
}

.word-display {
    font-size: 2rem;
    font-weight: 700;
    color: gray;
    letter-spacing: 1px;
    text-shadow: 
        0 2px 6px rgba(0, 0, 0, 0.4),
        0 0 10px rgba(0, 0, 0, 0.15);
    margin: 0;
    font-family: 'Segoe UI', system-ui, sans-serif;
    line-height: 1.4;
    text-align: center;
    overflow-wrap: break-word;
    hyphens: auto;
}

@media (max-width: 768px) {
    .glass-container {
        padding: 16px 20px;
    }
  
    .word-display {
        font-size: 1.8rem;
    }
}

@media (max-width: 576px) {
    .glass-container {
        width: 90vw;
        max-width: 90vw;
        padding: 16px;
        margin-top: 10vh;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
    }
  
    .word-display {
        font-size: clamp(1.5rem, 6vw, 1.8rem);
        line-height: 1.5;
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
