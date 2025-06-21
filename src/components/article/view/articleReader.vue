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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import ArticleReaderLayout from '@/components/article/layout/articleReaderLayout.vue';
import MarkdownRenderer from '@/components/markdown/markdownRenderer.vue';
import BubbleMenu from '@/components/article/bubbleMenu/articleBubbleMenu.vue';
import { useArticleStore } from '@/stores/articleStore';

const FONT_CONFIG = {
    min: 12,
    max: 36,
    default: 20
};

const PROGRESS_SAVE_DELAY = 2000;

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    articleId: {
        type: Number,
        required: false
    },
    pageCharCount: {
        type: Number,
        default: 1500
    },
    initialProgress: {
        type: Object as () => { progress?: number } | null,
        default: null
    }
});

const articleStore = useArticleStore();
const showBubbleMenu = ref(false);
const fontSize = ref(FONT_CONFIG.default);
const currentPage = ref(0);
const readingPosition = ref({ page: 0, scrollTop: 0 });
const isInitialized = ref(false);
const isRestoringProgress = ref(false);
let saveProgressTimeout: ReturnType<typeof setTimeout> | null = null;

const pagedContents = computed(() => {
    if (!props.content.trim()) return [''];
    
    const maxPageSize = props.pageCharCount + 100;
    const minPageSize = props.pageCharCount - 100;
    const result: string[] = [];
    
    const blocks: string[] = [];
    const lines = props.content.split('\n');
    let currentBlock: string[] = [];
    
    for (const line of lines) {
        if (line.trim() === '') {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'));
                currentBlock = [];
            }
            continue;
        }
        
        if (line.startsWith('#') || line.startsWith('```')) {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'));
                currentBlock = [];
            }
            blocks.push(line);
            continue;
        }
        
        currentBlock.push(line);
    }
    
    if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'));
    }
    
    let currentPageContent = '';
    for (const block of blocks) {
        const blockLength = block.length + 2;
        
        if (currentPageContent.length + blockLength <= maxPageSize) {
            currentPageContent += currentPageContent ? '\n\n' + block : block;
        } 
        else {
            if (currentPageContent) {
                result.push(currentPageContent);
                currentPageContent = '';
            }
            
            if (block.length > maxPageSize) {
                let start = 0;
                while (start < block.length) {
                    let end = Math.min(start + minPageSize, block.length);
                    
                    const lastPeriod = block.lastIndexOf('.', end);
                    const lastNewline = block.lastIndexOf('\n', end);
                    
                    if (lastNewline > start) end = lastNewline;
                    else if (lastPeriod > start) end = lastPeriod + 1;
                    
                    result.push(block.substring(start, end).trim());
                    start = end;
                }
            } 
            else {
                currentPageContent = block;
            }
        }
    }
    
    if (currentPageContent) {
        result.push(currentPageContent);
    }
    
    return result.length ? result : [''];
});

const totalPages = computed(() => pagedContents.value.length);
const currentPageContent = computed(() => pagedContents.value[currentPage.value]);

const progressPercentage = computed(() => {
    if (totalPages.value <= 1) return 100;
    return Math.min(100, Math.round((currentPage.value / (totalPages.value - 1)) * 100));
});

const saveReadingProgress = async () => {
    if (isRestoringProgress.value || !props.articleId) return;
    
    try {
        await articleStore.updateArticleReadingProgress({
            articleId: props.articleId,
            progress: progressPercentage.value
        });
    } catch (error) {
        console.error('保存阅读进度失败:', error);
    }
};

const debouncedSaveProgress = () => {
    if (saveProgressTimeout) clearTimeout(saveProgressTimeout);
    saveProgressTimeout = setTimeout(saveReadingProgress, PROGRESS_SAVE_DELAY);
};

const jumpToPercentage = (percentage: number, skipSave = false) => {
    if (percentage < 0 || percentage > 100) return;
    
    const targetPage = Math.min(
        totalPages.value - 1,
        Math.floor(percentage / 100 * totalPages.value)
    );
    
    if (targetPage !== currentPage.value) {
        currentPage.value = targetPage;
        readingPosition.value = { page: targetPage, scrollTop: 0 };
        
        if (!skipSave) {
            saveReadingProgress();
        }
    }
};

const prevPage = () => {
    if (currentPage.value > 0) {
        currentPage.value--;
        updateReadingPosition();
        debouncedSaveProgress();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
        currentPage.value++;
        updateReadingPosition();
        debouncedSaveProgress();
    }
};

const updateReadingPosition = () => {
    readingPosition.value = {
        page: currentPage.value,
        scrollTop: 0
    };
};

const adjustFontSize = (delta: number) => {
    fontSize.value = Math.max(
        FONT_CONFIG.min, 
        Math.min(FONT_CONFIG.max, fontSize.value + delta)
    );
    recalculatePagination();
};

const resetFontSize = () => {
    fontSize.value = FONT_CONFIG.default;
    recalculatePagination();
};

const recalculatePagination = () => {
    if (currentPage.value >= totalPages.value) {
        currentPage.value = Math.max(0, totalPages.value - 1);
    }
    updateReadingPosition();
};

watch(fontSize, recalculatePagination);

watch(() => props.content, () => {
    currentPage.value = 0;
    updateReadingPosition();
});

watch(currentPage, () => {
    if (!isRestoringProgress.value) {
        debouncedSaveProgress();
    }
});

watch(() => props.initialProgress, (newProgress) => {
    if (newProgress?.progress !== undefined && isInitialized.value) {
        jumpToPercentage(Math.min(100, Math.max(0, newProgress.progress)));
    }
});

onMounted(() => {
    const savedFontSize = localStorage.getItem('readerFontSize');
    if (savedFontSize) {
        const size = parseInt(savedFontSize);
        if (!isNaN(size)) {
            fontSize.value = Math.max(FONT_CONFIG.min, Math.min(FONT_CONFIG.max, size));
        }
    }
    
    recalculatePagination();
    
    if (props.initialProgress?.progress !== undefined) {
        isRestoringProgress.value = true;
        
        jumpToPercentage(
            Math.min(100, Math.max(0, props.initialProgress.progress)),
            true
        );
        
        setTimeout(() => {
            isRestoringProgress.value = false;
        }, 100);
    }
    
    isInitialized.value = true;
});

onUnmounted(() => {
    localStorage.setItem('readerFontSize', fontSize.value.toString());
    
    if (!isRestoringProgress.value) {
        saveReadingProgress();
    }
    
    if (saveProgressTimeout) clearTimeout(saveProgressTimeout);
});
</script>

<style scoped>
.markdown-content {
    flex: 1;
    transition: font-size 0.3s ease;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
}
</style>
