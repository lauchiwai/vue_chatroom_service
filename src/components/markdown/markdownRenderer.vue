<template>
    <div ref="markdownContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

import 'highlight.js/styles/github.css'

const props = defineProps<{
    content: string
}>()

const markdownContainer = ref<HTMLElement>()
const md = new MarkdownIt({
    html: false, 
    linkify: true,
    typographer: true,
    highlight: (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
        try {
            return `<pre><code class="hljs">${
            hljs.highlight(str, { language: lang }).value
            }</code></pre>`
        } catch {
            return ''
        }
        }
        return ''
    }
})

const renderMarkdown = () => {
    if (!markdownContainer.value) return

    const unsafeHtml = md.render(props.content)
    const cleanHtml = DOMPurify.sanitize(unsafeHtml, {
        ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'code', 'pre',
        'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4',
        'blockquote', 'a'
        ],
        ALLOWED_ATTR: ['href', 'class', 'target']
    })

    markdownContainer.value.innerHTML = cleanHtml
}

onMounted(renderMarkdown)
watch(() => 
    props.content, renderMarkdown
)
</script>
