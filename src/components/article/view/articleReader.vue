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
import { useArticleStore } from '@/stores/articleStore';

import ArticleReaderLayout from '@/components/article/layout/articleReaderLayout.vue';
import MarkdownRenderer from '@/components/markdown/markdownRenderer.vue';
import BubbleMenu from '@/components/article/bubbleMenu/articleBubbleMenu.vue';

const FONT_CONFIG = {
    min: 12,
    max: 36,
    default: 18
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
    const minPageSize = Math.max(500, props.pageCharCount - 500); 
    
    const result: string[] = [];
    const lines = props.content.split('\n');
    
    let currentPageContent = '';
    let inCodeBlock = false;
    let currentCodeBlock = '';
    let codeBlockStartIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('```') && !inCodeBlock) {
            inCodeBlock = true;
            codeBlockStartIndex = i;
            currentCodeBlock = line + '\n';
            continue;
        }

        if (trimmedLine.startsWith('```') && inCodeBlock) {
            inCodeBlock = false;
            currentCodeBlock += line;
            
            if (currentCodeBlock.length > maxPageSize) {
                if (currentPageContent) {
                    result.push(currentPageContent.trim());
                    currentPageContent = '';
                }
                result.push(currentCodeBlock);
                currentCodeBlock = '';
                continue;
            }
            
            if (currentPageContent.length + currentCodeBlock.length > maxPageSize) {
                if (currentPageContent) {
                    result.push(currentPageContent.trim());
                    currentPageContent = '';
                }
                currentPageContent = currentCodeBlock;
            } else {
                currentPageContent += (currentPageContent ? '\n\n' : '') + currentCodeBlock;
            }
            currentCodeBlock = '';
            continue;
        }

        if (inCodeBlock) {
            currentCodeBlock += line + '\n';
            continue;
        }
        const lineLength = line.length + 2;
        
        const isMajorBreak = trimmedLine.startsWith('#') || trimmedLine === '***' || trimmedLine === '---';
        
        if (currentPageContent.length + lineLength > maxPageSize) {
            if (currentPageContent) {
                result.push(currentPageContent.trim());
                currentPageContent = '';
            }
            
            if (lineLength > maxPageSize) {
                let start = 0;
                while (start < line.length) {
                    let end = Math.min(start + minPageSize, line.length);
                    
                    const lastSpace = line.lastIndexOf(' ', end);
                    const lastPeriod = line.lastIndexOf('.', end);
                    const breakPoint = lastPeriod > lastSpace ? lastPeriod + 1 : 
                                     lastSpace > start ? lastSpace : end;
                    
                    result.push(line.substring(start, breakPoint).trim());
                    start = breakPoint;
                }
                continue;
            }
        }

        if (isMajorBreak && currentPageContent.length > minPageSize) {
            result.push(currentPageContent.trim());
            currentPageContent = line;
        } else {
            currentPageContent += (currentPageContent ? '\n' : '') + line;
        }
    }

    if (inCodeBlock && currentCodeBlock) {
        if (currentPageContent && currentPageContent.length + currentCodeBlock.length > maxPageSize) {
            result.push(currentPageContent.trim());
            currentPageContent = currentCodeBlock;
        } else {
            currentPageContent += (currentPageContent ? '\n\n' : '') + currentCodeBlock;
        }
    }

    if (currentPageContent.trim()) {
        result.push(currentPageContent.trim());
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
        console.error('save reading progress error:', error);
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
    localStorage.setItem('readerFontSize', fontSize.value.toString());
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
