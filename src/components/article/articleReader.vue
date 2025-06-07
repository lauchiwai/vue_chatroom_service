<template>
    <div class="reader-container">
        <div class="page-indicator">
            <a-tag color="blue">第 {{ currentPage + 1 }} 頁 / 共 {{ totalPages }} 頁</a-tag>
            <a-tag color="orange" class="font-size-tag">{{ fontSize }}px</a-tag>
        </div>

        <div class="content-wrapper">
            <div class="markdown-viewer" ref="viewerContainer" @scroll="handleScroll">
                <div class="markdown-content" :style="{ fontSize: fontSize + 'px', lineHeight: lineHeight }">
                    <MarkdownRenderer :content="currentPageContent" />
                </div>
            </div>
            
            <a-float-button
                shape="square"
                type="default"
                @click="prevPage"
                :disabled="currentPage === 0"
                class="page-button prev-button"
            >
                <template #icon><LeftOutlined /></template>
            </a-float-button>
            
            <a-float-button
                shape="square"
                type="default"
                @click="nextPage"
                :disabled="currentPage === totalPages - 1"
                class="page-button next-button"
            >
                <template #icon><RightOutlined /></template>
            </a-float-button>
            
            <a-float-button-group
                trigger="click"
                :open="expanded"
                @openChange="handleOpenChange"
                class="action-buttons"
            >
                <template #icon>
                    <MenuUnfoldOutlined v-if="expanded" />
                    <MenuFoldOutlined v-else />
                </template>
                
                <a-float-button
                    type="default"
                    tooltip="返回主頁"
                    @click="goHome"
                >
                    <template #icon><HomeOutlined /></template>
                </a-float-button>
                
                <a-float-button
                    :type="isBookmarked ? 'primary' : 'default'"
                    tooltip="書籤"
                    @click="toggleBookmark"
                >
                    <template #icon><BookOutlined /></template>
                </a-float-button>
                
                <a-float-button
                    type="default"
                    tooltip="減小字號"
                    @click="adjustFontSize(-1)"
                    :disabled="fontSize <= minFontSize"
                >
                    <template #icon><ZoomOutOutlined /></template>
                </a-float-button>
                
                <a-float-button
                    type="default"
                    tooltip="增大字號"
                    @click="adjustFontSize(1)"
                    :disabled="fontSize >= maxFontSize"
                >
                    <template #icon><ZoomInOutlined /></template>
                </a-float-button>
                
                <a-float-button
                    type="default"
                    tooltip="重置字號"
                    @click="resetFontSize"
                >
                    <template #icon><RestOutlined /></template>
                </a-float-button>
            </a-float-button-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LeftOutlined,
    RightOutlined,
    HomeOutlined,
    BookOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    RestOutlined
} from '@ant-design/icons-vue'
import MarkdownRenderer from '@/components/markdown/markdownRenderer.vue'

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    pageCharCount: {
        type: Number,
        default: 1000
    }
})

const minFontSize = 12
const maxFontSize = 24
const defaultFontSize = 16
const fontSize = ref(defaultFontSize)
const lineHeight = computed(() => `${Math.min(1.6, 1.2 + fontSize.value / 100)}`)

const viewerContainer = ref<HTMLElement>()
const isBookmarked = ref(false)
const expanded = ref(false)
const currentPage = ref(0)
const readingPosition = ref({
    page: 0,
    scrollTop: 0
})

const wordCountInfo = computed(() => {
    if (!pagedContents.value.length) return null
    const current = pagedContents.value[currentPage.value].length
    const total = props.content.length
    return { current, total }
})

const adjustFontSize = (delta: number) => {
    const newSize = fontSize.value + delta
    fontSize.value = Math.max(minFontSize, Math.min(maxFontSize, newSize))
    recalculatePagination()
}

const resetFontSize = () => {
    fontSize.value = defaultFontSize
    recalculatePagination()
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

const toggleBookmark = () => {
    isBookmarked.value = !isBookmarked.value
}

const goHome = () => {
    console.log("返回主頁")
}

const handleOpenChange = (open: boolean) => {
    expanded.value = open
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

.font-size-tag{
    min-width: 80px;
    text-align: center;
    font-weight: 500;
}

.page-button {
    position: fixed;
    bottom: 80px;
    height: 40px;
    width: 40px;
    z-index: 101;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    border: 1px solid #d9d9d9;
}

.page-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
    box-shadow: none;
}

.page-button:disabled:hover {
    transform: none;
}

.prev-button {
    right: 110px;
}

.next-button {
    right: 60px;
}

.action-buttons {
    position: fixed;
    right: 10px;
    bottom: 80px;
    z-index: 101;
}

.action-buttons :deep(.ant-float-btn-group) {
    display: flex;
    flex-direction: column-reverse;
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 8px;
}

.action-buttons :deep(.ant-float-btn) {
    margin-bottom: 4px;
    height: 40px;
    width: 40px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    border: 1px solid #f0f0f0;
}

.action-buttons :deep(.ant-float-btn):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .page-button {
        bottom: 72px;
        height: 36px;
        width: 36px;
    }
    
    .prev-button {
        right: 100px;
    }
    
    .next-button {
        right: 55px;
    }
    
    .action-buttons {
        bottom: 72px;
        right: 8px;
    }
    
    .action-buttons :deep(.ant-float-btn) {
        height: 36px;
        width: 36px;
    }
    
    .font-size-tag {
        min-width: 70px;
        font-size: 12px;
    }
    
    .markdown-viewer {
        padding: 12px;
    }
}

@media (max-width: 480px) {
    .page-button {
        bottom: 73px;
        height: 32px;
        width: 34px;
    }
    
    .prev-button {
        right: 95px;
    }
    
    .next-button {
        right: 55px;
    }
    
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
