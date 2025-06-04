<template>
    <teleport to="body">
        <div
            v-if="show"
            class="bubble-menu"
            :data-instance="instanceId"
            :style="position"
        >
            <button @click="handleCopy">
                <span>复制</span>
            </button>
            <button @click="handleHighlight">
                <span>高亮</span>
            </button>
            <button @click="handleShare">
                <span>分享</span>
            </button>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    position: {
        type: Object,
        required: true,
        default: () => ({ top: '0px', left: '0px' })
    },
    instanceId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['copy', 'highlight', 'share'])

const handleCopy = () => {
    emit('copy')
}

const handleHighlight = () => {
    emit('highlight')
}

const handleShare = () => {
    emit('share')
}
</script>

<style scoped>
.bubble-menu {
    position: fixed;
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

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, 8px);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
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
