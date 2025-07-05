<template>
    <div class="search-container">
        <slot
            name="search-bar"
            :is-header-visible="isHeaderVisible"
        ></slot>
        
        <div class="content-wrapper" ref="contentElement">
            <slot :search-query="searchQuery"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import throttle from 'lodash/throttle';

const props = defineProps({
    initialQuery: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['scroll-bottom']);

const searchQuery = ref(props.initialQuery);
const isHeaderVisible = ref(true);
const lastScrollPosition = ref(0);
const contentElement = ref<HTMLElement | null>(null);

const handleScroll = throttle(() => {
    if (!contentElement.value) return;
    
    const currentScrollPosition = contentElement.value.scrollTop;
    
    if (currentScrollPosition <= 10) {
        isHeaderVisible.value = true;
        lastScrollPosition.value = currentScrollPosition;
        return;
    }
    
    const scrollingDown = currentScrollPosition > lastScrollPosition.value;
    
    if (scrollingDown && currentScrollPosition > 100) {
        isHeaderVisible.value = false;
    } else if (!scrollingDown) {
        isHeaderVisible.value = true;
    }
    
    lastScrollPosition.value = currentScrollPosition;
    
    const { scrollTop, scrollHeight, clientHeight } = contentElement.value;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
    
    if (distanceToBottom < 300) {
        emit('scroll-bottom');
    }
}, 50);

const setupEventListeners = () => {
    if (contentElement.value) {
        contentElement.value.addEventListener('scroll', handleScroll);
    }
};

const removeEventListeners = () => {
    if (contentElement.value) {
        contentElement.value.removeEventListener('scroll', handleScroll);
    }
    if (typeof handleScroll.cancel === 'function') {
        handleScroll.cancel();
    }
};

onMounted(() => {
    setupEventListeners();
});

onBeforeUnmount(() => {
    removeEventListeners();
});
</script>

<style scoped lang="scss">
.search-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #f8f9fa;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.content-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}
</style>
