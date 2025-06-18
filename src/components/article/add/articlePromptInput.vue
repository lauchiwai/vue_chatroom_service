<template>
    <div class="article-prompt-input-container" ref="containerRef">
        <div class="input-wrapper" :class="{ 'has-focus': isFocused }">
            <a-textarea
                ref="textareaRef"
                v-model:value="prompt"
                placeholder="請輸入提示詞創建文章"
                :auto-size="{ minRows: 4, maxRows: maxRows }"
                @pressEnter="handlePressEnter"
                @focus="isFocused = true"
                @blur="isFocused = false"
                class="prompt-textarea"
            />
            <div class="action-tools-wrapper">
                <a-tooltip :title="'範例'">
                </a-tooltip>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useArticleStore } from '@/stores/articleStore'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['generate'])

const articleStore = useArticleStore()
const { prompt } = storeToRefs(articleStore)
const isFocused = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const containerHeight = ref(0)

const maxRows = computed(() => {
    const lineHeight = 24
    const padding = 32
    const maxVisibleLines = Math.floor((containerHeight.value - padding) / lineHeight)
    return Math.max(4, Math.min(12, maxVisibleLines))
})

const handlePressEnter = (e: KeyboardEvent) => {
    if (!e.shiftKey) {
        e.preventDefault()
        emit('generate')
    }
}

const updateHeight = () => {
    if (!containerRef.value) return
    
    const parent = containerRef.value.parentElement
    if (parent) {
        const parentRect = parent.getBoundingClientRect()
        const siblings = Array.from(parent.children)
            .filter(el => el !== containerRef.value)
        
        let siblingsHeight = 0
        siblings.forEach(el => {
            const rect = el.getBoundingClientRect()
            siblingsHeight += rect.height
        })
        
        containerHeight.value = parentRect.height - siblingsHeight - 20
        containerRef.value.style.height = `${containerHeight.value}px`
    }
}

onMounted(() => {
    updateHeight()
    window.addEventListener('resize', updateHeight)
    
    const observer = new MutationObserver(updateHeight)
    if (containerRef.value?.parentElement) {
        observer.observe(containerRef.value.parentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        })
    }
    
    onUnmounted(() => {
        window.removeEventListener('resize', updateHeight)
        observer.disconnect()
    })
})
</script>

<style lang="scss" scoped>
.article-prompt-input-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    box-sizing: border-box;
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    min-height: 180px;

    .input-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        transition: all 0.3s;
        padding: 8px;
        background-color: #fff;
        overflow: hidden;
        
        &.has-focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
    }

    :deep(.prompt-textarea) {
        flex: 1;
        width: 100%;
        border: none !important;
        resize: none;
        padding: 8px;
        font-size: 16px;
        line-height: 1.5;
        min-height: 100px;
        box-shadow: none !important;
        overflow-y: auto;
        box-sizing: border-box;
        
        .ant-input {
            border: none !important;
            padding: 0 !important;
            height: 100% !important;
        }
        
        &:focus {
            box-shadow: none !important;
        }
        
        &::-webkit-scrollbar {
            width: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }
    }

    .action-tools-wrapper {
        width: 100%;
        padding: 8px 10px 0;
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;
    }
}

@media (max-width: 768px) {
    .article-prompt-input-container {
        padding: 12px;
        border-radius: 8px;
        min-height: 160px;
        
        .input-wrapper {
            min-height: 100px;
        }
        
        :deep(.prompt-textarea) {
            font-size: 14px;
            min-height: 80px;
            
            .ant-input {
                font-size: 14px !important;
            }
        }
    }
}
</style>
