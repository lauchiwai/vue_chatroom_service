<template>
    <div class="search-container">
        <slot name="search-bar"></slot>
        
        <div class="content-wrapper" ref="contentElement">
            <slot :search-query="searchQuery"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue';

const props = defineProps({
    initialQuery: {
        type: String,
        default: ''
    },
    freezeHeader: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['scroll-bottom']);

const searchQuery = ref(props.initialQuery);
const contentElement = ref<HTMLElement | null>(null);
const lastScrollPosition = ref(0);
const rafId = ref<number | null>(null);

const handleScroll = () => {
    if (props.freezeHeader) return;
    
    if (rafId.value) {
        cancelAnimationFrame(rafId.value);
    }
    
    rafId.value = requestAnimationFrame(() => {
        if (!contentElement.value) return;
        
        const { scrollTop, scrollHeight, clientHeight } = contentElement.value;
        const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
        
        if (distanceToBottom < 300) {
            emit('scroll-bottom');
        }
        
        rafId.value = null;
    });
};

onMounted(() => {
    if (contentElement.value) {
        contentElement.value.addEventListener('scroll', handleScroll);
    }
});

onBeforeUnmount(() => {
    if (contentElement.value) {
        contentElement.value.removeEventListener('scroll', handleScroll);
    }
    if (rafId.value) {
        cancelAnimationFrame(rafId.value);
    }
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
}

.content-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}
</style>
