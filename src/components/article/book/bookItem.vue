<template>
    <div class="article-card">
        <div class="scale-container">
            <div class="frosted-layer" :style="{ backgroundColor: articleColor }"></div>
            <div class="article-icon">
                <i class="material-icons">{{ articleIcon }}</i>
            </div>
        </div>
        <div class="title-container">
            <span class="article-title">{{ title }}</span>
        </div>
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
    return `hsla(${h}, 50%, 40%, 0.4)` 
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
    position: relative;
    overflow: hidden;
}

.scale-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover .scale-container {
    transform: scale(1.1);
}

.frosted-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    z-index: 0;
    transition: backdrop-filter 0.3s ease;
}

.article-icon {
    position: absolute;
    transform: rotate(30deg);
    left: -40%;
    top: 15%;
    z-index: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.article-card:hover .article-icon {
    opacity: 0.85;
}

.article-icon .material-icons {
    font-size: 15rem;
    color: rgba(255, 255, 255, 0.9); 
    transition: all 0.3s ease;
}

.title-container {
    position: absolute;
    bottom: 1.5rem;
    right: 1rem;
    z-index: 3;
    padding: 5px 15px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    box-shadow: 
        0 1px 1px rgba(255, 255, 255, 0.3) inset,
        0 2px 6px rgba(0, 0, 0, 0.1);
    border: 0.5px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
}

.article-title {
    font-size: 1.4rem;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
    margin: 0;
    line-height: 1.5;
    letter-spacing: 0.5px;
    word-break: break-word;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
    font-weight: 600;
}

@media (max-width: 1400px) {
    .article-icon .material-icons {
        font-size: 13rem;
    }
}

@media (max-width: 1200px) {
    .article-icon .material-icons {
        font-size: 11rem;
    }
}

@media (max-width: 1024px) {
    .article-icon .material-icons {
        font-size: 12rem;
    }
}

@media (max-width: 900px) {
    .article-icon .material-icons {
        font-size: 11rem;
    }
}

@media (max-width: 768px) {
    .article-card {
        padding: 1rem;
        border-radius: 8px;
    }
    
    .article-icon {
        left: -35%;
        top: 10%;
    }
    
    .article-icon .material-icons {
        font-size: 14rem;
    }
    
    .title-container {
        padding: 8px 12px;
        bottom: 1rem;
        right: 0.8rem;
    }
    
    .article-title {
        font-size: 1.3rem;
    }
}

@media (max-width: 600px) {
    .article-icon .material-icons {
        font-size: 11rem;
    }
    
    .article-title {
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .article-icon {
        left: -30%;
        top: 5%;
    }
    
    .article-icon .material-icons {
        font-size: 8rem;
    }
    
    .title-container {
        padding: 6px 10px;
        bottom: 0.8rem;
        right: 0.6rem;
    }
    
    .article-title {
        font-size: 1rem;
    }
}

@media (max-width: 400px) {
    .article-icon .material-icons {
        font-size: 7rem;
    }
    
    .title-container {
        padding: 5px 8px;
    }
    
    .article-title {
        font-size: 0.9rem;
    }
}
</style>
