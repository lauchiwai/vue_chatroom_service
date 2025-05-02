<template>
    <div ref="markdownContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

import 'highlight.js/styles/github-dark.css'

const props = defineProps<{
    content: string
}>()

const markdownContainer = ref<HTMLElement>()
const md : any = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight: (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs-pre"><code class="hljs language-${lang}">${
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
                }</code></pre>`
            } catch (__) {}
        }
        
        try {
            const result = hljs.highlightAuto(str)
            return `<pre class="hljs-pre"><code class="hljs language-${result.language}">${result.value}</code></pre>`
        } catch (__) {
            return `<pre class="hljs-pre"><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`
        }
    }
})

const renderMarkdown = async () => {
    if (!markdownContainer.value) return

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

onMounted(renderMarkdown)
watch(() => props.content, renderMarkdown)
</script>

<style>
.hljs-pre {
    background: #f6f8fa;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
    width: 100%;

    overflow-x: auto;
    word-wrap: normal;
    white-space: pre-wrap; 
    word-break: break-all;
}

.hljs-pre::-webkit-scrollbar {
    height: 8px;
}

.hljs-pre::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.hljs-pre::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.hljs-pre::-webkit-scrollbar-thumb:hover {
    background: #555;
}

a[target="_blank"]::after {
    content: "↗";
    font-size: 0.8em;
    margin-left: 2px;
}
</style>