<template>
    <div v-if="props.message.role != 'system'"
         :class="['message-item', { 'user-message': props.message.role == 'user' }]" 
    >
        <div class="message-content">
            <div class="message-text">
                <MarkdownRenderer :content="props.message.content"/>
            </div>
            <div class="message-time">{{ props.message.timestamp }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chatHistory/chatHistory'
import MarkdownRenderer from '@/components/markdown/markdownRenderer.vue'
const props = defineProps({
    message: {
        type: Object as () => ChatMessage,
        required: true
    },
})
</script>

<style lang="scss" scoped>
.message-item {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;

    &.user-message {
        flex-direction: row-reverse;

        .message-content {
            background: #f0f8ff;
            border-radius: 12px 0 12px 12px;
        }
    }

    .message-content {
        max-width: 80%;
        min-width: 300px;
        padding: 12px 16px;
        background: white;
        border-radius: 0 12px 12px 12px;
        border: 2px solid #E0E0E0;
    
        .message-text {
            font-size: 16px;
            line-height: 1.6;
            color: #333;
        }

        .message-time {
            margin-top: 4px;
            font-size: 12px;
            color: #999;
            text-align: right;
        }
    }
}

@media (max-width: 768px) {
    .message-item {
        .message-content {
            max-width: 100%;
        }
    }
}
</style>