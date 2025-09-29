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
            >
                <div class="page-container">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const handlePrevPage = () => emit('prev-page')
const handleNextPage = () => emit('next-page')
const handleAdjustFontSize = (delta: number) => emit('adjust-font-size', delta)
const handleResetFontSize = () => emit('reset-font-size')

const goHome = () => {
    router.push({ name: ROUTE_NAMES.HOME })
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
}

.page-container {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
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
}
</style>
