<template>
    <div ref="markdownContainer"
        class="markdown-wrapper"
        @mouseup.capture="handleTextSelection"
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

const getScrollParent = (element: HTMLElement | null): HTMLElement => {
    if (!element) return document.documentElement
    
    const style = getComputedStyle(element)
    const excludeStaticParent = style.position === 'absolute'
    const overflowRegex = /(auto|scroll|overlay)/
    
    let parent = element.parentElement
    
    while (parent) {
        const parentStyle = getComputedStyle(parent)
        
        if (excludeStaticParent && parentStyle.position === 'static') {
            parent = parent.parentElement
            continue
        }
        
        if (overflowRegex.test(parentStyle.overflow + parentStyle.overflowY + parentStyle.overflowX)) {
            return parent
        }
        
        parent = parent.parentElement
    }
    
    return document.documentElement
}

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
    const scrollParent = getScrollParent(container)
    const scrollTop = scrollParent === document.documentElement 
        ? window.scrollY 
        : scrollParent.scrollTop
    const scrollLeft = scrollParent === document.documentElement 
        ? window.scrollX 
        : scrollParent.scrollLeft

    bubblePosition.value = {
        top: `${rect.top + scrollTop - 40}px`,
        left: `${rect.left + scrollLeft + rect.width / 2}px`
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
</style>
