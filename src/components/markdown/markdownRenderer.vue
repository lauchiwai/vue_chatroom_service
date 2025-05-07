<template>
    <div ref="markdownContainer" 
        class="markdown-wrapper"
        @mouseup.capture="handleTextSelection"
        :data-markdown-instance="instanceId"
    ></div>
    
    <div v-if="showBubbleMenu" 
        class="bubble-menu"
        :data-instance="instanceId"
        :style="bubblePosition"
    >
        <button @click="handleCopy" >
            <span>复制</span>
        </button>
        <button @click="handleHighlight">
            <span>高亮</span>
        </button>
        <button @click="handleShare">
            <span>分享</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

import 'highlight.js/styles/github-dark.css'

const props = defineProps<{
    content: string
}>()

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

const handleTextSelection = (e: MouseEvent) => {
    const selection = window.getSelection()
    if (!selection || selection.toString().trim() === '') {
        showBubbleMenu.value = false
        return
    }

    const range = selection.getRangeAt(0)
    const container = markdownContainer.value
    if (!container || !container.contains(range.commonAncestorContainer)) {
        showBubbleMenu.value = false
        return
    }

    const rect = range.getBoundingClientRect()
    bubblePosition.value = {
        top: `${rect.top + window.scrollY - 40}px`,
        left: `${rect.left + window.scrollX + rect.width / 2}px`
    }
    
    showBubbleMenu.value = true
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
    if (text) {
        navigator.share?.({ text }).catch(console.error)
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
}

.bubble-menu {
    position: absolute;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateX(-50%);
    z-index: 2147483647;
    display: flex;
    gap: 4px;
    animation: fadeIn 0.15s ease-out;
}

.bubble-menu button {
    padding: 6px 10px;
    border: none;
    background: #f8fafc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
}

.bubble-menu button:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
}

.hljs {
    padding: 1.2rem !important;
    border-radius: 8px;
    margin: 1rem 0;
    overflow-x: auto;
}

.text-highlight {
    background: rgba(255, 235, 0, 0.3);
    padding: 0 2px;
    border-radius: 2px;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, 8px); }
    to { opacity: 1; transform: translate(-50%, 0); }
}

@media (max-width: 640px) {
    .bubble-menu {
        gap: 2px;
        padding: 4px;
    }
    
    .bubble-menu button {
        padding: 4px 8px;
    }
}
</style>