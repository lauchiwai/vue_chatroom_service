<template>
    <div ref="markdownContainer"
        class="markdown-wrapper"
        @mouseup.capture="handleTextSelection"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @touchmove="handleTouchMove"
        :data-markdown-instance="instanceId"
    ></div>

    <BubbleMenu
        :show="showBubbleMenu"
        :position="bubblePosition"
        :instanceId="instanceId"
        @copy="handleCopy"
        @highlight="handleHighlight"
        @share="handleShare"
    />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import BubbleMenu from '@/components/bubbleMenu/articleBubbleMenu.vue'

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

const instanceId = uuidv4()
const markdownContainer = ref<HTMLElement>()

const md: any = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
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

const showBubbleMenu = ref(false)
const bubblePosition = ref({ top: '0px', left: '0px' })

const touchStartTime = ref(0)
const isTouchMoving = ref(false)
const touchStartPosition = ref({ x: 0, y: 0 })
const touchEndPosition = ref({ x: 0, y: 0 })

const processSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.toString().trim() === '') {
        showBubbleMenu.value = false
        return false
    }

    const range = selection.getRangeAt(0)
    const container = markdownContainer.value
    if (!container || !container.contains(range.commonAncestorContainer)) {
        showBubbleMenu.value = false
        return false
    }

    const rect = range.getBoundingClientRect()
    
    const scrollX = window.scrollX || document.documentElement.scrollLeft
    const scrollY = window.scrollY || document.documentElement.scrollTop

    bubblePosition.value = {
        top: `${rect.top + scrollY - 40}px`,
        left: `${rect.left + scrollX + rect.width / 2}px`
    }

    showBubbleMenu.value = true
    return true
}

const handleTextSelection = (e: MouseEvent) => {
    if (Date.now() - touchStartTime.value < 600) return
    processSelection()
}

const handleTouchStart = (e: TouchEvent) => {
    if (!e.touches.length) return
    
    const touch = e.touches[0]
    touchStartTime.value = Date.now()
    isTouchMoving.value = false
    touchStartPosition.value = {
        x: touch.clientX,
        y: touch.clientY
    }
    showBubbleMenu.value = false
}

const handleTouchMove = (e: TouchEvent) => {
    if (!e.touches.length) return
    
    const touch = e.touches[0]
    const moveThreshold = 10; 
    
    const deltaX = Math.abs(touch.clientX - touchStartPosition.value.x)
    const deltaY = Math.abs(touch.clientY - touchStartPosition.value.y)
    
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
        isTouchMoving.value = true
    }
}

const handleTouchEnd = (e: TouchEvent) => {
    if (!e.changedTouches.length) return
    
    const touch = e.changedTouches[0]
    touchEndPosition.value = {
        x: touch.clientX,
        y: touch.clientY
    }
    
    const touchDuration = Date.now() - touchStartTime.value
    if (touchDuration > 500 && !isTouchMoving.value) {
        const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement
        if (element) {
            setTimeout(() => {
                if (processSelection()) {
                    if (navigator.vibrate) {
                        navigator.vibrate(50)
                    }
                }
            }, 100)
        }
    }
}

const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const isBubbleMenu = target.closest(`[data-instance="${instanceId}"]`)
    const isCurrentMarkdown = target.closest(`[data-markdown-instance="${instanceId}"]`)

    if (!isBubbleMenu && !isCurrentMarkdown) {
        showBubbleMenu.value = false
    }
}

const handleCopy = async () => {
    try {
        await navigator.clipboard.writeText(window.getSelection()?.toString() || '')
    } catch (err) {
        console.error('复制失败:', err)
    }
    clearSelection()
}

const handleHighlight = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const span = document.createElement('span')
        span.className = 'text-highlight'
        span.appendChild(range.extractContents())
        range.insertNode(span)
    }
    clearSelection()
}

const handleShare = () => {
    const text = window.getSelection()?.toString()
    if (text && navigator.share) {
        navigator.share({ text }).catch(console.error)
    } else {
        alert(`分享文本: ${text}`)
    }
    clearSelection()
}

const clearSelection = () => {
    window.getSelection()?.removeAllRanges()
    showBubbleMenu.value = false
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
    document.addEventListener('click', handleClickOutside)
    renderMarkdown()
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

watch(() => props.content, renderMarkdown)
</script>

<style scoped>
.markdown-wrapper {
    line-height: 1.6;
    color: #333;
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 12px;
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
        padding: 15px;
        border-radius: 8px;
    }
    
    .hljs {
        padding: 1rem !important;
        font-size: 14px;
    }
}
</style>
