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
                <div class="markdown-content" :style="{ fontSize: fontSize + 'px', lineHeight: lineHeight }">
                    <MarkdownRenderer :content="currentPageContent" />
                </div>
            </div>
            
            <FloatingActionButtons
                :current-page="currentPage"
                :total-pages="totalPages"
                :font-size="fontSize"
                :min-font-size="minFontSize"
                :max-font-size="maxFontSize"
                @prev-page="prevPage"
                @next-page="nextPage"
                @adjust-font-size="adjustFontSize"
                @reset-font-size="resetFontSize"
                @go-home="goHome"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import MarkdownRenderer from '@/components/markdown/markdownRenderer.vue'
import FloatingActionButtons from '@/components/article/floatingButtons/floatingActionButton.vue'

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    pageCharCount: {
        type: Number,
        default: 1000
    },
    showFloatButtonMenu: {
        type:Boolean,
        default:true
    }
})

const minFontSize = 12
const maxFontSize = 36
const defaultFontSize = 20
const fontSize = ref(defaultFontSize)
const lineHeight = computed(() => `${Math.min(1.6, 1.2 + fontSize.value / 100)}`)

const viewerContainer = ref<HTMLElement>()
const currentPage = ref(0)
const readingPosition = ref({
    page: 0,
    scrollTop: 0
})

const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const isSwiping = ref(false)
const swipeThreshold = 50
const verticalThreshold = 30

function handleTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return
    touchStartX.value = event.touches[0].clientX
    touchStartY.value = event.touches[0].clientY
    isSwiping.value = false
}

function handleTouchMove(event: TouchEvent) {
    if (event.touches.length !== 1) return
    const touchY = event.touches[0].clientY
    const deltaY = Math.abs(touchY - touchStartY.value)
    
    if (deltaY > verticalThreshold && !isSwiping.value) {
        isSwiping.value = false
        return
    }
    
    if (!isSwiping.value) {
        isSwiping.value = true
    }
    event.preventDefault()
}

function handleTouchEnd(event: TouchEvent) {
    if (!isSwiping.value || event.changedTouches.length !== 1) return
    touchEndX.value = event.changedTouches[0].clientX
    const deltaX = touchEndX.value - touchStartX.value

    if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
            prevPage()
        } else {
            nextPage()
        }
    }
    
    isSwiping.value = false
}

const pagedContents = computed(() => {
    if (!props.content.trim()) return ['']
    
    const maxPageSize = props.pageCharCount + 100
    const minPageSize = props.pageCharCount - 100
    const result: string[] = []
    
    const blocks: string[] = []
    const lines = props.content.split('\n')
    let currentBlock: string[] = []
    
    for (const line of lines) {
        if (line.trim() === '') {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'))
                currentBlock = []
            }
            continue
        }
        
        if (line.startsWith('#') || line.startsWith('##') || line.startsWith('###')) {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'))
                currentBlock = []
            }
            blocks.push(line)
            continue
        }
        
        if (line.startsWith('```')) {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'))
                currentBlock = []
            }
            blocks.push(line)
            continue
        }
        
        currentBlock.push(line)
    }
    
    if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'))
    }
    
    let currentPageContent = ''
    for (const block of blocks) {
        if (currentPageContent.length + block.length + 2 <= maxPageSize) {
            currentPageContent += (currentPageContent ? '\n\n' : '') + block
        } else {
            if (currentPageContent) {
                result.push(currentPageContent)
                currentPageContent = ''
            }
            
            if (block.length > maxPageSize) {
                const chunkSize = Math.max(minPageSize, Math.floor(maxPageSize * 0.8))
                let start = 0
                while (start < block.length) {
                    let end = Math.min(start + chunkSize, block.length)
                    
                    const lastPeriod = block.lastIndexOf('.', end)
                    const lastNewline = block.lastIndexOf('\n', end)
                    
                    if (lastNewline > start && lastNewline > lastPeriod) {
                        end = lastNewline
                    } else if (lastPeriod > start) {
                        end = lastPeriod + 1
                    }
                    
                    result.push(block.substring(start, end).trim())
                    start = end
                }
            } else {
                currentPageContent = block
            }
        }
    }
    
    if (currentPageContent) {
        result.push(currentPageContent)
    }
    
    return result.length ? result : ['']
})

const recalculatePagination = () => {
    const newTotalPages = pagedContents.value.length
    if (currentPage.value >= newTotalPages) {
        currentPage.value = newTotalPages - 1
    }
    readingPosition.value = {
        page: currentPage.value,
        scrollTop: 0
    }
    scrollToTop()
}

const totalPages = computed(() => pagedContents.value.length)
const currentPageContent = computed(() => pagedContents.value[currentPage.value])

const prevPage = () => {
    if (currentPage.value > 0) {
        currentPage.value--
        readingPosition.value = {
            page: currentPage.value,
            scrollTop: 0
        }
        scrollToTop()
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
        currentPage.value++
        readingPosition.value = {
            page: currentPage.value,
            scrollTop: 0
        }
        scrollToTop()
    }
}

const scrollToTop = () => {
    if (viewerContainer.value) {
        viewerContainer.value.scrollTop = 0
    }
}

const adjustFontSize = (delta: number) => {
    const newSize = fontSize.value + delta
    fontSize.value = Math.max(minFontSize, Math.min(maxFontSize, newSize))
    recalculatePagination()
}

const resetFontSize = () => {
    fontSize.value = defaultFontSize
    recalculatePagination()
}

const goHome = () => {
    console.log("返回主頁")
}

watch(fontSize, recalculatePagination)

let scrollTimeout: ReturnType<typeof setTimeout> | null = null
const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout)
    
    scrollTimeout = setTimeout(() => {
        if (viewerContainer.value && currentPage.value === readingPosition.value.page) {
            readingPosition.value.scrollTop = viewerContainer.value.scrollTop
        }
    }, 100)
}

watch(() => props.content, (newContent) => {
    currentPage.value = 0
    readingPosition.value = { page: 0, scrollTop: 0 }
})

onMounted(() => {
    if (viewerContainer.value) {
        viewerContainer.value.addEventListener('scroll', handleScroll)
    }
    
    const savedFontSize = localStorage.getItem('readerFontSize')
    if (savedFontSize) {
        fontSize.value = Math.max(minFontSize, Math.min(maxFontSize, parseInt(savedFontSize)))
    }
    
    nextTick(recalculatePagination)
})

onUnmounted(() => {
    if (viewerContainer.value) {
        viewerContainer.value.removeEventListener('scroll', handleScroll)
    }
    if (scrollTimeout) clearTimeout(scrollTimeout)
    
    localStorage.setItem('readerFontSize', fontSize.value.toString())
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

.markdown-content {
    flex: 1;
    transition: font-size 0.3s ease;
    max-width: 800px;
    margin: 0 auto;
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
