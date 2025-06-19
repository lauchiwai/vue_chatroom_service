<template>
    <div class="word-card">
        <div class="frosted-layer" :style="{ backgroundColor: articleColor }"></div>
        <div class="word-container">
            <span class="word-title">{{ word.word }}</span>
        </div>
        <div class="review-status-container">
            <span class="review-status-text">{{ reviewStatusText }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { WordType } from '@/types/word/word';
import { computed } from 'vue'

const props = defineProps({
    word: {
        type: Object as () => WordType,
        required: true
    },
})

const articleColor = computed(() => {
    return generateHSL(props.word.word)
})

const reviewStatusText = computed(() => {
    if (!props.word.lastReviewed) {
        return 'new';
    }
    
    const date = new Date(props.word.lastReviewed);
    return `last: ${date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })}`;
})

const generateHSL = (text: string): string => {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash)
    }
    const h = Math.abs(hash % 360)
    return `hsla(${h}, 50%, 40%, 0.4)` 
}
</script>

<style scoped lang="scss">
.word-card {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.frosted-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    z-index: 0;
    transition: backdrop-filter 0.3s ease;
}

.word-container {
    position: relative;
    z-index: 3;
    border-radius: 12px;
    text-align: center;
    max-width: 85%;
}

.word-title {
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.9);
    margin: 0;
    line-height: 1.4;
    letter-spacing: 0.5px;
    word-break: break-word;
    font-weight: 700;
}

.review-status-container {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    z-index: 3;
    padding: 8px 16px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    box-shadow: 
        0 1px 2px rgba(0, 0, 0, 0.2),
        0 1px 1px rgba(255, 255, 255, 0.1) inset;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.review-status-text {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
    white-space: nowrap;
}



@media (max-width: 1200px) {
    .word-title {
        font-size: 1.6rem;
    }
}

@media (max-width: 768px) {
    .word-title {
        font-size: 1.4rem;
    }
    
}

@media (max-width: 480px) {
    .word-title {
        font-size: 1.2rem;
    }
    
    .review-status-text {
        font-size: 0.8rem;
    }
}

</style>
