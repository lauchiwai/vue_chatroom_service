<template>
    <div class="flashcard-container">
        <div class="title-container">
            <div class="title-left">
                <span>WordFlashCard</span>
            </div>
            <div class="title-right">
                <button @click="handelViewMoreEvent">
                    <span>more</span>
                    <RightOutlined class="arrow-icon" />
                </button>
            </div>
        </div>

        <div class="scroll-wrapper">
            <div 
                class="main-content-container" 
                ref="scrollContainer" 
                :class="{ 
                    'space-between-layout': layoutMode === 'space-between'
                }"
            >
                <div class="stats-item" v-if="words.length == 0 && !loading">
                    <EmptyCard />
                </div>

                <div class="stats-item"  v-for="word in words" >
                    <WordCard  
                        @click-event="handelViewEvent"
                        :key="word.wordId"
                        :item="word"
                    />
                </div>
            </div>

            <button v-show="leftControlsAble" class="scroll-btn left" @click="scroll(positionEnum.left)">
                <LeftOutlined class="scroll-btn-icon"/>
            </button>
            <button v-show="rightControlsAble" class="scroll-btn right" @click="scroll(positionEnum.right)">
                <RightOutlined class="scroll-btn-icon"/>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { WordType } from '@/types/word/word';

import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { RightOutlined, LeftOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useWordStore } from '@/stores/wordStore';
import { ROUTE_NAMES } from '@/router'

import EmptyCard from '@/components/common/emptyCard.vue'
import WordCard from '@/components/word/wordCard/wordCard.vue'

enum positionEnum {
    left,
    right
}

const router = useRouter()
const wordStore = useWordStore();
const scrollContainer = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const leftControlsAble = ref(false)
const rightControlsAble = ref(false)
const loading = ref(false)
const layoutMode = ref<'flex-start' | 'space-between'>('flex-start')
const words = ref<WordType[]> ([]);

const handelViewEvent = (word: WordType) => {
    router.push({ 
        name: ROUTE_NAMES.WORD_VIEW, 
        params: { id: word.wordId } 
    })
}

const handelViewMoreEvent = () => {
    router.push({ 
        name: ROUTE_NAMES.WORD, 
    })
}

const totalItems = () => {
    return words.value.length
}

const checkLayoutMode = () => {
    if (!scrollContainer.value) return
    
    const width = window.innerWidth
    const count = totalItems()
    
    if (width >= 1025 && count >= 4) {
        layoutMode.value = 'space-between'
    } else if (width >= 768 && width <= 1024 && count >= 3) {
        layoutMode.value = 'space-between'
    } else {
        layoutMode.value = 'flex-start'
    }
}

const checkOverflow = () => {
    if (!scrollContainer.value) return
    
    const container = scrollContainer.value
    const hasOverflow = container.scrollWidth > container.clientWidth
    const atStart = container.scrollLeft <= 0
    const atEnd = container.scrollLeft >= (container.scrollWidth - container.clientWidth - 1) 
    
    leftControlsAble.value = hasOverflow && !atStart
    rightControlsAble.value = hasOverflow && !atEnd
}

const scroll = (position: positionEnum) => {
    if (!scrollContainer.value) return
    
    const container = scrollContainer.value
    const scrollAmount = container.clientWidth * 0.8
    const currentScroll = container.scrollLeft
    const maxScroll = container.scrollWidth - container.clientWidth
    
    const target = position === positionEnum.left
        ? Math.max(0, currentScroll - scrollAmount)
        : Math.min(maxScroll, currentScroll + scrollAmount)
    
    container.scrollTo({
        left: target,
        behavior: 'smooth'
    })

    setTimeout(() => {
        checkOverflow()
    }, 300) 
}

const handleResize = () => {
    if (!scrollContainer.value) return
    containerWidth.value = scrollContainer.value.clientWidth
    checkLayoutMode()
    checkOverflow()
}

watch(() => words.value.length, () => {
    nextTick(() => {
        checkLayoutMode()
        checkOverflow()
    })
})

const initArticleList = async() =>{
    loading.value = true;
    words.value = await wordStore.getWordList()
    loading.value = false;
}

onMounted(async () => {
    await initArticleList();
    await nextTick()
    handleResize()
    window.addEventListener('resize', handleResize)
    

    if (scrollContainer.value) {
        scrollContainer.value.addEventListener('scroll', checkOverflow)
    }
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    
    if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', checkOverflow)
    }
})
</script>

<style scoped lang="scss">
.flashcard-container {
    width: 100%;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03), 
                0 1px 6px -1px rgba(0,0,0,0.02), 
                0 2px 4px 0 rgba(0,0,0,0.02);
    padding: 20px;
    box-sizing: border-box;
    position: relative;
}

.scroll-wrapper {
    position: relative;
    margin-top: 16px;
    overflow: hidden;
    padding: 8px 0;

    .main-content-container {
        display: flex;
        overflow-x: auto;
        scroll-behavior: smooth;
        scrollbar-width: none;
        padding: 10px 0;
        justify-content: flex-start;
        gap: 3%;
        
        &::-webkit-scrollbar { 
            display: none; 
        }

        &.space-between-layout {
            justify-content: space-between;
            
            .stats-item {
                margin-right: 0 !important;
            }
        }

        .stats-item {
            flex: 0 0 auto;
            aspect-ratio: 1/1;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            background: #fff;
            
            &:hover {
                transform: translateY(-4px) scale(1.03);
                box-shadow: 0 6px 16px rgba(0,0,0,0.15);
                z-index: 2;
            }
        }
    }

    .scroll-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        width: 36px;
        height: 100%;
        border: none;
        background-color: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        opacity: 0.9;
       

        &:hover {
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
        }

        &.left { 
            left: -10px; 
        }

        &.right { 
            right: -10px; 
        }
        
        .scroll-btn-icon {
            font-size: 22px;
            color: #333;
        }
    }
}

.title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;

    .title-left {
        font-size: 18px;
        font-weight: 600;
        color: #333;
    }

    .title-right {
        font-size: 16px;

        span { 
            text-align: center;
            font-size: 14px;
        }
        .arrow-icon { 
            font-size: 12px; 
            margin-left: 6px; 
        }
        button {
            background-color: transparent;
            display: flex;
            align-items: center;
            border: none;
            border-radius: 4px;
            color: #666;
            cursor: pointer;
            padding: 4px 8px;
            transition: all 0.2s;

            &:hover { 
                background-color: #f5f5f5; 
                color: #1890ff;
            }
        }
    }
}

@media (min-width: 1025px) {
    .stats-item {
        width: calc(23% - 1%);
    }

    .space-between-layout .stats-item {
        width: 23%;
    }
}

@media (max-width: 1024px) and (min-width: 768px) {
    .stats-item {
        width: calc(31.333% - 1.333%);
    }
    .space-between-layout .stats-item {
        width: 31.333%;
    }
}

@media (max-width: 767px) {
    .stats-item {
        width: calc(47.5% - 1%);
        
        &:not(:last-child) {
            margin-right: 3%;
        }
    }
  
    .main-content-container {
        justify-content: flex-start !important;
        gap: 3% !important;
        
        .stats-item {
            margin-right: 0 !important;
        }
    }
}

.main-content-container {
    scroll-snap-type: x mandatory;
    scroll-padding: 0 20px;
    
    .stats-item {
        scroll-snap-align: start;
    }
}
</style>
