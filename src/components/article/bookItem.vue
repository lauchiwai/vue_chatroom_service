<template>
    <div class="article-card"
        :style="{ backgroundColor: articleColor }"
    >
        <div class="article-icon">
            <i class="material-icons">{{ articleIcon }}</i>
        </div>
        <h3 class="article-title">{{ title }}</h3>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
})

const iconPool = [
    'article',
    'auto_stories',
    'description',
    'history_edu',
    'library_books',
    'menu_book',
    'science',
    'castle'
]

const articleColor = computed(() => {
  return generateHSL(props.title)
})

const articleIcon = computed(() => {
  return selectIcon(props.title)
})

const generateHSL = (text: string): string => {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash)
    }
    const h = Math.abs(hash % 360)
    return `hsl(${h}, 50%, 40%)` 
}

const selectIcon = (text: string): string => {
    const index = Math.abs(text.split('')
        .reduce((sum, char) => sum + char.charCodeAt(0), 0)) % iconPool.length
    return iconPool[index]
}
</script>

<style scoped lang="scss">
.article-card {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover{
    transform: scale(1.1);
}

.article-icon {
    margin-bottom: 1rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.article-icon .material-icons {
    font-size: 2.2rem;
    color: rgba(255, 255, 255, 0.9); 
}

.article-title {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9); 
    text-align: center;
    margin: 0;
    line-height: 1.5;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: 500;
}

@media (max-width: 768px) {
    .article-card {
        padding: 1rem;
        border-radius: 8px;
    }
    
    .article-icon .material-icons {
        font-size: 1.8rem;
    }
  
    .article-title {
        font-size: 1rem;
    }
}
</style>