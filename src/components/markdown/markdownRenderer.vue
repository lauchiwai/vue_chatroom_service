<template>
    <div ref="markdownContainer"
        class="markdown-wrapper"
        @mouseup="handleTextSelection"
        :data-markdown-instance="instanceId"
    ></div>

    <slot name="bubbleMenu" 
        :selectedText="selectedText"
        :position="bubblePosition"
        :instanceId="instanceId"
    >
    </slot>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useScreenStore } from '@/stores/screenStore'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import 'highlight.js/styles/github-dark.css'

const props = defineProps({
    content: {
        type: String,
        required: true
    },
    pageCharCount: {
        type: Number,
        default: 1000
    }
})

const store = useScreenStore()
const instanceId = uuidv4()
const markdownContainer = ref<HTMLElement>()
const selectedText = ref('')
const isMobile = computed(() => store.isMobile)
const isSystemMenuActive = ref(false)
const systemMenuObserver = ref<MutationObserver | null>(null)

const md: any = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code class="language-${lang}">${
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
                }</code></pre>`
            } catch (__) {}
        }

        try {
            const result = hljs.highlightAuto(str)
            return `<pre class="hljs"><code class="language-${result.language}">${result.value}</code></pre>`
        } catch (__) {
            return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
        }
    }
})
const showBubbleMenu = defineModel('showBubbleMenu', { type: Boolean, required: true })
const bubblePosition = ref({ top: '0px', left: '0px' })

const setupSystemMenuObserver = () => {
    systemMenuObserver.value = new MutationObserver((mutations) => {
        const systemMenu = document.querySelector('div[role="menu"]')
        isSystemMenuActive.value = !!systemMenu
        
        if (!systemMenu && !window.getSelection()?.toString()) {
            showBubbleMenu.value = false
            selectedText.value = ''
        }
    })
    
    if (systemMenuObserver.value && document.body) {
        systemMenuObserver.value.observe(document.body, {
            childList: true,
            subtree: true
        })
    }
}

const processSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.toString().trim() === '') {
        if (!isSystemMenuActive.value) {
            showBubbleMenu.value = false
            selectedText.value = ''
        }
        return false
    }

    selectedText.value = selection.toString().trim()

    const range = selection.getRangeAt(0)
    const container = markdownContainer.value
    if (!container || !container.contains(range.commonAncestorContainer)) {
        showBubbleMenu.value = false
        selectedText.value = ''
        return false
    }

    const rect = range.getBoundingClientRect()
    const scrollX = window.scrollX || document.documentElement.scrollLeft
    const scrollY = window.scrollY || document.documentElement.scrollTop

    let topPosition = 0
    let leftPosition = 0

    if (isMobile.value) {
        topPosition = rect.bottom + scrollY + 50
        leftPosition = rect.left + scrollX + rect.width / 2
    } else {
        topPosition = rect.top + scrollY - 50
        leftPosition = rect.left + scrollX + rect.width / 2
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const bubbleMenuWidth = 200
    const bubbleMenuHeight = 50
    const margin = 10

    const halfBubbleWidth = bubbleMenuWidth / 2
    const leftBound = leftPosition - halfBubbleWidth
    const rightBound = leftPosition + halfBubbleWidth

    if (leftBound < scrollX + margin) {
        leftPosition = scrollX + margin + halfBubbleWidth
    } else if (rightBound > scrollX + viewportWidth - margin) {
        leftPosition = scrollX + viewportWidth - margin - halfBubbleWidth
    }

    if (isMobile.value) {
        if (topPosition + bubbleMenuHeight > scrollY + viewportHeight - margin) {
            topPosition = rect.top + scrollY - bubbleMenuHeight - margin
            if (topPosition < scrollY + margin) {
                topPosition = scrollY + viewportHeight - bubbleMenuHeight - margin
            }
        }
    } else {
        if (topPosition < scrollY + margin) {
            topPosition = rect.bottom + scrollY + margin
            if (topPosition + bubbleMenuHeight > scrollY + viewportHeight - margin) {
                topPosition = scrollY + margin
            }
        } else if (topPosition + bubbleMenuHeight > scrollY + viewportHeight - margin) {
            topPosition = rect.top + scrollY - bubbleMenuHeight - margin
            if (topPosition < scrollY + margin) {
                topPosition = scrollY + viewportHeight - bubbleMenuHeight - margin
            }
        }
    }

    bubblePosition.value = {
        top: `${topPosition}px`,
        left: `${leftPosition}px`
    }

    showBubbleMenu.value = true
    return true
}

const handleTextSelection = (e: MouseEvent) => {
    if (isMenuEvent(e)) {
        return 
    }

    processSelection()
}

const isMenuEvent = (e: MouseEvent) =>{
    const target = e.target as HTMLElement

    const isSystemMenu = target.closest('div[role="menu"]')
    const isBubbleMenu = target.closest('.bubble-menu') 
    return isSystemMenu || isBubbleMenu
}

const handleSelectionChange = () => {
    const selection = window.getSelection()
    if (!selection || selection.toString().trim() === '') {
        if (!isSystemMenuActive.value) {
            showBubbleMenu.value = false
            selectedText.value = ''
        }
    } else {
        if (isMobile.value) {
            setTimeout(processSelection, 100)
        } else {
            processSelection()
        }
    }
}

const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement

    const isSelectionProcess = window.getSelection()?.toString().trim() !== ''
    if (isMenuEvent(e) || isSelectionProcess) {
        return 
    }
    
    const isCurrentMarkdown = target.closest(`[data-markdown-instance="${instanceId}"]`)
    if (!isCurrentMarkdown) {
        showBubbleMenu.value = false
        selectedText.value = ''
        
        const selection = window.getSelection()
        if (selection) selection.removeAllRanges()
    }
}

const renderMarkdown = async () => {
    if (!markdownContainer.value) return

    markdownContainer.value.dataset.markdownInstance = instanceId

    const unsafeHtml = md.render(props.content)
    const cleanHtml = DOMPurify.sanitize(unsafeHtml, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'code', 'pre',
            'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4',
            'blockquote', 'a', 'span', 'div'
        ],
        ALLOWED_ATTR: ['href', 'class', 'target', 'rel'],
        FORBID_ATTR: ['style', 'onclick']
    })

    markdownContainer.value.innerHTML = cleanHtml

    await nextTick()
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement)
    })
}

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('selectionchange', handleSelectionChange)
    setupSystemMenuObserver()
    renderMarkdown()
})

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('selectionchange', handleSelectionChange)
    if (systemMenuObserver.value) {
        systemMenuObserver.value.disconnect()
    }
})

watch(() => props.content, renderMarkdown)
</script>

<style scoped lang="scss">
.markdown-wrapper {
    line-height: 1.6;
    color: #333;
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 60px;
    border-radius: 12px;
    -webkit-touch-callout: default;
    user-select: text;
    -webkit-user-select: text;
}

:deep(.bubble-menu-container) {
    position: fixed;
    z-index: 2147483647;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

:deep(.system-menu-active .bubble-menu-container) {
    opacity: 0.9;
    z-index: 2147483646;
}

:deep(.bubble-menu) {
    pointer-events: auto;
    transform: translate(-50%, 0);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.hljs {
    padding: 1.2rem !important;
    border-radius: 8px;
    margin: 1rem 0;
    overflow-x: auto;
    background: #1e1e1e;
    color: #dcdcdc;
}

.text-highlight {
    background: rgba(255, 235, 0, 0.3);
    padding: 0 2px;
    border-radius: 2px;
}

@media (max-width: 768px) {
    .markdown-wrapper {
        border-radius: 8px;
    }
    
    .hljs {
        padding: 1rem !important;
        font-size: 14px;
    }
    
    :deep(.bubble-menu) {
        transform: translate(-50%, 10px);
    }
}
</style>
