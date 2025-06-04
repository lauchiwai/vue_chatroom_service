<template>
    <a-card :style="{ width: '100%' }">
        <template #title>
            <div class="title-container">
                <div class="title-left">
                    <span>FlashCard</span>
                </div>
                <div class="title-right">
                    <button>
                        <span>more</span>
                        <RightOutlined class="arrow-icon" />
                    </button>
                </div>
            </div>
        </template>

        <div class="scroll-wrapper">
            <div class="main-content-container" ref="scrollContainer">
                <StatsCard 
                    :number="0" 
                    title="Article" 
                    color="#2894FF" 
                    class="stats-item"
                />

                <CardAddTrigger 
                    class="stats-item"
                    @click-event="handelAddEvent"
                />

                <BookCard  
                    v-for="bookTitle in bookList" 
                    :key="bookTitle"
                    :title="bookTitle"
                    class="stats-item"
                />
            </div>

            <button v-if="showControls" class="scroll-btn left" @click="scroll(positionEnum.left)">
                <LeftOutlined class="scroll-btn-icon"/>
            </button>
            <button v-if="showControls" class="scroll-btn right" @click="scroll(positionEnum.right)">
                <RightOutlined class="scroll-btn-icon"/>
            </button>
        </div>
    </a-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RightOutlined, LeftOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

import BookCard from '@/components/article/bookCard.vue'
import CardAddTrigger from '@/components/home/cardAddTrigger.vue'
import StatsCard from '@/components/home/statsCard.vue'

enum positionEnum {
    left,
    right
}

const router = useRouter()
const bookList = ref<string[]>(["蠟筆小新", "哈利波特", "哆啦A夢", "新增项1", "新增项2", "新增项3", "新增项4", "新增项5"])
const scrollContainer = ref<HTMLElement | null>(null)
const containerWidth = ref(0)

const showControls = computed(() => {
    if(scrollContainer.value)
        return scrollContainer.value?.scrollWidth > scrollContainer.value?.clientWidth
    else
        return false;
})

const handelAddEvent = () =>{
    router.push('GenerateActicle')
}

const updateContainerWidth = () => {
    containerWidth.value = scrollContainer.value?.clientWidth || 0
}

const scroll = (position: positionEnum) => {
    if (!scrollContainer.value) return
    
    const currentScroll = scrollContainer.value.scrollLeft
    const maxScroll = scrollContainer.value.scrollWidth - containerWidth.value
    const scrollAmount = containerWidth.value  
    
    let direction = position == positionEnum.left ? -1 : 1
    let padding = position == positionEnum.left ? - 10 : +10
    let target = currentScroll + (scrollAmount * direction)

    target = Math.max(0, Math.min(target, maxScroll)) + padding  
    
    scrollContainer.value.scrollTo({
        left: target,
        behavior: 'smooth'
    })
}

const handleResize = () => updateContainerWidth()

onMounted(() => {
    updateContainerWidth()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.scroll-wrapper {
    position: relative;

    .main-content-container {
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        grid-auto-flow: column;
        gap: 20px;
        overflow-x: auto;
        scroll-behavior: smooth;
        scrollbar-width: none;

        &::-webkit-scrollbar { display: none; }

        grid-auto-columns: calc((100% - 60px) / 4);
        @media (max-width: 900px) { grid-auto-columns: calc((100% - 40px) / 3); }
        @media (max-width: 600px) { grid-auto-columns: calc((100% - 20px) / 2); }
    }

    .scroll-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        width: 30px;
        height: 100%;
        border-radius: 4px;
        border: none;
        background: rgb(105, 105, 105, 0.1);

        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        &.left { 
            left: -20px; 
            font-size: 20px; 
            color: gray; 
        }
        &.left:hover { 
            .scroll-btn-icon{
                transform: scale(1.4); 
            }
        }
        &.right { 
            right: -20px; 
            font-size: 20px; 
            color: gray;
        }
        &.right:hover { 
            .scroll-btn-icon{
                transform: scale(1.4); 
            } 
        }
    }
}

.stats-item {
    height: 100%;
    min-width: 0;
}

.title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title-right {
        font-size: 16px;

        span { text-align: center; }
        .arrow-icon { font-size: 12px; margin-left: 10px; }
        button {
            background-color: transparent;
            display: flex;
            align-items: center;
            border: none;
            border-radius: 4px;
            color: gray;
            cursor: pointer;

            &:hover { background-color: #F0F0F0; }
        }
    }
}
</style>