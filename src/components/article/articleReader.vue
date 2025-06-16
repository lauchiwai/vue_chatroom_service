<template>
    <ArticleReaderLayout 
        :content="content" 
        :page-char-count="pageCharCount"
        :current-page="currentPage"
        :total-pages="totalPages"
        :current-page-content="currentPageContent"
        :font-size="fontSize"
        @prev-page="prevPage"
        @next-page="nextPage"
        @adjust-font-size="adjustFontSize"
        @reset-font-size="resetFontSize"
        @jump-to-percentage="jumpToPercentage"
    >
        <template #content="{ content, fontSize, lineHeight }">
            <div class="markdown-content" :style="{ 
                fontSize: fontSize + 'px', 
                lineHeight: lineHeight 
            }">
                <MarkdownRenderer 
                    v-model:show-bubble-menu="showBubbleMenu"
                    :content="content"
                >
                    <template #bubbleMenu="{ selectedText, position, instanceId }">
                        <BubbleMenu
                            :selected-text="selectedText"
                            v-model:show="showBubbleMenu"
                            :position="position"
                            :instanceId="instanceId"
                        />
                    </template>
                </MarkdownRenderer>
            </div>
        </template>
    </ArticleReaderLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ArticleReaderLayout from '@/components/article/layout/articleReaderLayout.vue'
import MarkdownRenderer from '@/components/markdown/markdownRenderer.vue'
import BubbleMenu from '@/components/article/bubbleMenu/articleBubbleMenu.vue'

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    pageCharCount: {
        type: Number,
        default: 3000
    }
})

const showBubbleMenu = ref(false)

const minFontSize = 12
const maxFontSize = 36
const defaultFontSize = 20
const fontSize = ref(defaultFontSize)
const currentPage = ref(0)
const readingPosition = ref({ page: 0, scrollTop: 0 })

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

const totalPages = computed(() => pagedContents.value.length)
const currentPageContent = computed(() => pagedContents.value[currentPage.value])

const progress = computed(() => {
    if (totalPages.value <= 1) return 1.0
    return (currentPage.value + 1) / totalPages.value
})

watch(progress, (newProgress) => {
    console.log(`当前阅读进度: ${newProgress * 100}%`)
})

const jumpToPercentage = (percentage: number) => {
    if (percentage < 0 || percentage > 100) return
    
    const targetProgress = percentage / 100
    const targetPage = Math.min(
        totalPages.value - 1,
        Math.floor(targetProgress * totalPages.value)
    )
    
    currentPage.value = targetPage
    readingPosition.value = { page: targetPage, scrollTop: 0 }
    
    console.log(`跳转到: ${percentage}% → 第 ${targetPage + 1}/${totalPages.value} 页`)
}

const recalculatePagination = () => {
    const newTotalPages = pagedContents.value.length
    if (currentPage.value >= newTotalPages) {
        currentPage.value = newTotalPages - 1
    }
    readingPosition.value = {
        page: currentPage.value,
        scrollTop: 0
    }
}

const prevPage = () => {
    if (currentPage.value > 0) {
        currentPage.value--
        readingPosition.value = {
            page: currentPage.value,
            scrollTop: 0
        }
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
        currentPage.value++
        readingPosition.value = {
            page: currentPage.value,
            scrollTop: 0
        }
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

watch(fontSize, recalculatePagination)

watch(() => props.content, (newContent) => {
    currentPage.value = 0
    readingPosition.value = { page: 0, scrollTop: 0 }
})

onMounted(() => {
    const savedFontSize = localStorage.getItem('readerFontSize')
    if (savedFontSize) {
        fontSize.value = Math.max(minFontSize, Math.min(maxFontSize, parseInt(savedFontSize)))
    }
    
    recalculatePagination()
})

onUnmounted(() => {
    localStorage.setItem('readerFontSize', fontSize.value.toString())
})
</script>

<style scoped>
.markdown-content {
    flex: 1;
    transition: font-size 0.3s ease;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}
</style>
