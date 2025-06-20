<template>
    <div class="reader-container">
        <div class="page-indicator">
            <a-tag color="blue">第 {{ currentPage + 1 }} 頁 / 共 {{ totalPages }} 頁</a-tag>
            <a-tag color="orange" class="font-size-tag">{{ fontSize }}px</a-tag>
        </div>

        <div class="content-wrapper">
            <div 
                class="markdown-viewer" 
                ref="viewerContainer"
                @scroll="handleScroll"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
            >
                <div 
                    class="page-container"
                    :style="pageTransformStyle"
                    :data-dir="swipeDirection"
                    :data-swiping="isSwiping"
                >
                    <slot 
                        name="content"
                        :content="currentPageContent"
                        :fontSize="fontSize"
                        :lineHeight="lineHeight"
                    ></slot>
                </div>
            </div>
            
            <FloatingActionButtons
                :current-page="currentPage"
                :total-pages="totalPages"
                :font-size="fontSize"
                :min-font-size="minFontSize"
                :max-font-size="maxFontSize"
                @prev-page="handlePrevPage"
                @next-page="handleNextPage"
                @adjust-font-size="handleAdjustFontSize"
                @reset-font-size="handleResetFontSize"
                @go-home="goHome"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ROUTE_NAMES } from '@/router'
import { useRouter } from 'vue-router'

import FloatingActionButtons from '@/components/article/floatingButtons/floatingActionButton.vue'

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    pageCharCount: {
        type: Number,
        default: 3000
    },
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    currentPageContent: {
        type: String,
        required: true
    },
    fontSize: {
        type: Number,
        required: true
    },
    minFontSize: {
        type: Number,
        default: 12
    },
    maxFontSize: {
        type: Number,
        default: 36
    }
})

const emit = defineEmits([
    'prev-page', 
    'next-page', 
    'adjust-font-size', 
    'reset-font-size'
])

const lineHeight = computed(() => `${Math.min(1.6, 1.2 + props.fontSize / 100)}`)
const router = useRouter()
const viewerContainer = ref<HTMLElement>()
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const isSwiping = ref(false)
const swipeThreshold = 50

const pageOffsetX = ref(0)
const isAnimating = ref(false)
const animationDuration = ref(300)
const swipeDirection = ref<'left' | 'right' | null>(null)

const pageTransformStyle = computed(() => ({
    transform: `translateX(${pageOffsetX.value}px)`,
    transition: isAnimating.value ? `transform ${animationDuration.value}ms ease-out` : 'none'
}))

const handlePrevPage = () => emit('prev-page')
const handleNextPage = () => emit('next-page')
const handleAdjustFontSize = (delta: number) => emit('adjust-font-size', delta)
const handleResetFontSize = () => emit('reset-font-size')

const goHome = () => {
    router.push({ name: ROUTE_NAMES.HOME })
}

watch(() => props.currentPage, () => {
    pageOffsetX.value = 0
    swipeDirection.value = null
})

function handleTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return
    touchStartX.value = event.touches[0].clientX
    touchStartY.value = event.touches[0].clientY
    isSwiping.value = false
    isAnimating.value = false
    pageOffsetX.value = 0
    swipeDirection.value = null
}

function handleTouchMove(event: TouchEvent) {
    if (event.touches.length !== 1 || isAnimating.value) return
    
    const touchX = event.touches[0].clientX
    const touchY = event.touches[0].clientY
    const deltaX = touchX - touchStartX.value
    const deltaY = touchY - touchStartY.value

    if (!isSwiping.value && Math.abs(deltaY) > Math.abs(deltaX)) {
        return 
    }

    if (!isSwiping.value) {
        isSwiping.value = true
    }
    
    pageOffsetX.value = deltaX
    swipeDirection.value = deltaX > 0 ? 'right' : 'left'
    
    if (Math.abs(pageOffsetX.value) > 100) {
        pageOffsetX.value = pageOffsetX.value > 0 ? 
            100 + (pageOffsetX.value - 100) * 0.3 : 
            -100 + (pageOffsetX.value + 100) * 0.3
    }
    
    event.preventDefault()
}

function handleTouchEnd(event: TouchEvent) {
    if (!isSwiping.value || event.changedTouches.length !== 1 || isAnimating.value) return
    
    touchEndX.value = event.changedTouches[0].clientX
    const deltaX = touchEndX.value - touchStartX.value
    const containerWidth = viewerContainer.value?.offsetWidth || window.innerWidth
    const shouldFlip = Math.abs(deltaX) > swipeThreshold

    isAnimating.value = true
    isSwiping.value = false

    if (shouldFlip) {
        pageOffsetX.value = deltaX > 0 ? containerWidth : -containerWidth
        
        setTimeout(() => {
            if (deltaX > 0) {
                emit('prev-page')
            } else {
                emit('next-page')
            }
            
            setTimeout(() => {
                pageOffsetX.value = 0
                isAnimating.value = false
            }, 50)
        }, animationDuration.value)
    } else {
        pageOffsetX.value = 0
        setTimeout(() => {
            isAnimating.value = false
        }, animationDuration.value)
    }
}

let scrollTimeout: ReturnType<typeof setTimeout> | null = null
const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {}, 100)
}

onMounted(() => {
    if (viewerContainer.value) {
        viewerContainer.value.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    if (viewerContainer.value) {
        viewerContainer.value.removeEventListener('scroll', handleScroll)
    }
    if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<style scoped>
.reader-container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: transparent;
    border-radius: 12px;
    box-sizing: border-box;
    padding-bottom: 25px;
}

.content-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    overflow: hidden;
    background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.markdown-viewer {
    flex: 1;
    background: white;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 8px;
    perspective: 1200px;
}

.page-container {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    backface-visibility: hidden;
    will-change: transform;
}

.page-container::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    pointer-events: none;
    transition: opacity 0.3s ease;
    opacity: 0;
}

.page-container[data-dir="left"]::after {
    right: 0;
    background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
}

.page-container[data-dir="right"]::after {
    left: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
}

.page-container[data-swiping="true"]::after {
    opacity: 1;
}

.page-indicator {
    position: sticky;
    top: 0;
    right: 0;
    z-index: 100;
    text-align: right;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-bottom: 1px solid #f0f0f0;
}

.font-size-tag {
    min-width: 80px;
    text-align: center;
    font-weight: 500;
}

@media (max-width: 768px) {
    .font-size-tag {
        min-width: 70px;
        font-size: 12px;
    }
    
    .markdown-viewer {
        padding: 12px;
    }
    
    .page-container {
        transition-duration: 0.25s;
    }
}

@media (max-width: 480px) {
    .font-size-tag {
        min-width: 60px;
        font-size: 11px;
        padding: 0 4px;
    }
    
    .page-indicator {
        flex-wrap: wrap;
        justify-content: flex-end;
    }
    
    .page-container {
        transition-duration: 0.2s;
    }
}
</style>
