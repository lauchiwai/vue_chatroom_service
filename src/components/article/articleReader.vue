<template>
    <div class="reader-container">
        <div class="page-indicator">
            <a-tag color="blue">第 {{ currentPage + 1 }} 页 / 共 {{ totalPages }} 页</a-tag>
            <a-tag color="orange" class="font-size-tag">{{ fontSize }}px</a-tag>
        </div>

        <div class="content-wrapper">
            <div class="markdown-viewer" ref="viewerContainer">
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
                    tooltip="返回主页"
                    @click="goHome"
                >
                    <template #icon><HomeOutlined /></template>
                </a-float-button>
                
                <a-float-button
                    :type="isBookmarked ? 'primary' : 'default'"
                    tooltip="书签"
                    @click="toggleBookmark"
                >
                    <template #icon><BookOutlined /></template>
                </a-float-button>
                
                <a-float-button
                    type="default"
                    tooltip="减小字号"
                    @click="adjustFontSize(-1)"
                    :disabled="fontSize <= minFontSize"
                >
                    <template #icon><ZoomOutOutlined /></template>
                </a-float-button>
                
                <a-float-button
                    type="default"
                    tooltip="增大字号"
                    @click="adjustFontSize(1)"
                    :disabled="fontSize >= maxFontSize"
                >
                    <template #icon><ZoomInOutlined /></template>
                </a-float-button>
                
                <a-float-button
                    type="default"
                    tooltip="重置字号"
                    @click="resetFontSize"
                >
                    <template #icon><RestOutlined /></template>
                </a-float-button>
            </a-float-button-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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

const adjustFontSize = (delta: number) => {
    const newSize = fontSize.value + delta
    fontSize.value = Math.max(minFontSize, Math.min(maxFontSize, newSize))
    recalculatePagination()
}

const resetFontSize = () => {
    fontSize.value = defaultFontSize
    recalculatePagination()
}

const splitLongWord = (word: string, maxLength: number): string[] => {
    const chunks: string[] = []
    for (let i = 0; i < word.length; i += maxLength) {
        chunks.push(word.slice(i, i + maxLength))
    }
    return chunks
}

const pagedContents = computed(() => {
    if (!props.content.trim()) return ['']
    
    const adjustedPageCharCount = Math.floor(props.pageCharCount * (defaultFontSize / fontSize.value))
    
    const words = props.content.split(/\s+/).filter(word => word.length > 0)
    const result: string[] = []
    let currentPageWords: string[] = []
    let currentCharCount = 0
    
    for (const word of words) {
        const wordLength = word.length
        
        if (wordLength > adjustedPageCharCount / 2) {
            if (currentPageWords.length > 0) {
                result.push(currentPageWords.join(' '))
                currentPageWords = []
                currentCharCount = 0
            }
            const chunks = splitLongWord(word, adjustedPageCharCount)
            for (const chunk of chunks.slice(0, -1)) {
                result.push(chunk)
            }
            currentPageWords = [chunks[chunks.length - 1]]
            currentCharCount = chunks[chunks.length - 1].length
            continue
        }
        
        if (currentCharCount + wordLength + (currentPageWords.length > 0 ? 1 : 0) > adjustedPageCharCount) {
            if (currentPageWords.length > 0) {
                result.push(currentPageWords.join(' '))
                currentPageWords = []
                currentCharCount = 0
            }
        }
        
        currentPageWords.push(word)
        currentCharCount += wordLength + (currentPageWords.length > 1 ? 1 : 0)
    }
    
    if (currentPageWords.length > 0) {
        result.push(currentPageWords.join(' '))
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
    console.log("返回主页")
}

const handleOpenChange = (open: boolean) => {
    expanded.value = open
}

watch(fontSize, () => {
    recalculatePagination()
})

let scrollTimeout: ReturnType<typeof setTimeout> | null = null
const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout)
    
    scrollTimeout = setTimeout(() => {
        if (viewerContainer.value && currentPage.value === readingPosition.value.page) {
            readingPosition.value.scrollTop = viewerContainer.value.scrollTop
        }
    }, 100)
}

watch(() => props.content, (newContent, oldContent) => {
    if (newContent.length < oldContent.length) {
        currentPage.value = 0
        readingPosition.value = { page: 0, scrollTop: 0 }
        return
    }
    
    const addedContent = newContent.slice(oldContent.length)
    const currentPageLength = pagedContents.value[currentPage.value]?.length || 0
    
    const remainingSpace = Math.floor(props.pageCharCount * (defaultFontSize / fontSize.value)) - currentPageLength
    
    if (addedContent.length <= remainingSpace) {
        readingPosition.value.page = currentPage.value
        scrollToTop()
    } else {
        const newPage = Math.floor(newContent.length / Math.floor(props.pageCharCount * (defaultFontSize / fontSize.value)))
        currentPage.value = newPage
        readingPosition.value = {
            page: newPage,
            scrollTop: 0
        }
        scrollToTop()
    }
})

onMounted(() => {
    if (viewerContainer.value) {
        viewerContainer.value.addEventListener('scroll', handleScroll)
    }
    
    const savedFontSize = localStorage.getItem('readerFontSize')
    if (savedFontSize) {
        fontSize.value = Math.max(minFontSize, Math.min(maxFontSize, parseInt(savedFontSize)))
    }
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
}

.markdown-viewer {
    flex: 1;
    background: transparent;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.markdown-content {
    padding: 16px;
    flex: 1;
    transition: font-size 0.3s ease;
}

.page-indicator {
    position: sticky;
    top: 0;
    right: 0;
    z-index: 100;
    text-align: right;
    padding: 8px 16px;
    background: transparent;
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.font-size-tag {
    min-width: 60px;
    text-align: center;
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
}

.page-button:hover {
    transform: scale(1.05);
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
        min-width: 50px;
    }
}
</style>
