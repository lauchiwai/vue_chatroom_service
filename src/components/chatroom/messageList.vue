<template>
    <div ref="listRef" class="message-wrapper">
        <emptyMessage 
            v-if="messages.length == 0"
        />

        <MessageItem 
            v-for="(msg, index) in messages"
            :key="index"
            :message="msg"
        />

        <MessageItem 
            v-if="streamChatMsg.content"
            :message="streamChatMsg"
        />
    </div>
</template>
  
<script setup lang="ts">
import type { ChatMessage } from '@/types/chatHistory/chatHistory'
import { ref, watch, computed } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { storeToRefs } from 'pinia'

import MessageItem from '@/components/chatroom/messageItem.vue'
import emptyMessage from '@/components/chatroom/emptyMessage.vue'

const listRef = ref<HTMLElement>()
const chatStore = useChatStore()

const { messages, currentSession, tempAssistantMessage } = storeToRefs(chatStore)
const streamChatMsg = computed<ChatMessage>(() => ({
    role: 'assistant',
    content: tempAssistantMessage.value,
    timestamp: ''
} as ChatMessage));

watch(() => currentSession.value, async () => {
    if(currentSession.value[0] != undefined) {
        await chatStore.fetchChatHistory(currentSession.value[0])
        await chatStore.refreshChatSessionTime(currentSession.value[0])
    }
}, { deep: true })
</script>

<style lang="scss" scoped>
.message-wrapper{
    height: 100%;
    width: 100%;
}
</style>