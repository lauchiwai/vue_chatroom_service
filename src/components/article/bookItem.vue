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
    position: relative;
    overflow: hidden;
}

.article-card:hover {
    transform: scale(1.1);
}

.article-icon {
    position: absolute;
    transform: rotate(30deg);
    left: -40%;
    top: 15%;
    z-index: 0;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.article-icon .material-icons {
    font-size: 15rem;
    color: rgba(255, 255, 255, 0.9); 
    transition: font-size 0.3s ease;
}

.article-title {
    font-size: 2.2rem;
    color: white;
    text-shadow: 
        -2px -2px 0 gray,  
        2px -2px 0 gray,
        -2px 2px 0 gray,
        2px 2px 0 gray,
        0 0 4px gray;
    text-align: center;
    margin: 0;
    line-height: 1.5;
    letter-spacing: 0.5px;
    font-weight: 500;
    z-index: 1;
    transition: font-size 0.3s ease;
    padding: 0 10px;
    word-break: break-word;
}

@media (max-width: 1400px) {
    .article-icon .material-icons {
        font-size: 13rem;
    }
    
    .article-title {
        font-size: 2rem;
    }
}

@media (max-width: 1200px) {
    .article-icon .material-icons {
        font-size: 11rem;
    }
    
    .article-title {
        font-size: 1.4rem;
    }
}

@media (max-width: 1024px) {
    .article-icon .material-icons {
        font-size: 12rem;
    }
    
    .article-title {
        font-size: 1.6rem;
    }
}

@media (max-width: 900px) {
    .article-icon .material-icons {
        font-size: 11rem;
    }
    
    .article-title {
        font-size: 1.5rem;
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
  
    .article-title {
        font-size: 2.3rem;
    }
}

@media (max-width: 600px) {
    .article-icon .material-icons {
        font-size: 11rem;
    }
    
    .article-title {
        font-size: 1.3rem;
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
    
    .article-title {
        font-size: 1.2rem;
    }
}

@media (max-width: 400px) {
    .article-icon .material-icons {
        font-size: 7rem;
    }
    
    .article-title {
        font-size: 0.9rem;
    }
}

@media (max-height: 600px) and (min-width: 768px) {
    .article-icon .material-icons {
        font-size: 8rem;
    }
    
    .article-title {
        font-size: 1.5rem;
    }
}
</style>
