<template>
    <div ref="listRef" class="message-wrapper">
        <template v-if="loading">
            <div class="spin-loading-wrapper">
                <a-spin />
            </div>
        </template>
      
        <template v-else>
            <EmptyMessage 
                v-if="messages.length == 0"
            />

            <MessageItem 
                v-for="(msg, index) in messages"
                :key="index"
                :message="msg"
            />

            <MessageLoading 
                v-if="isChatAsyncing && !streamChatMsg.content"
            />

            <MessageItem 
                v-else-if="streamChatMsg.content"
                :message="streamChatMsg"
            />
        </template>
    </div>
</template>
  
<script setup lang="ts">
import type { ChatMessage } from '@/types/chatHistory/chatHistory'
import { ref, watch, computed } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { storeToRefs } from 'pinia'

import MessageItem from '@/components/chatroom/messageItem.vue'
import EmptyMessage from '@/components/chatroom/emptyMessage.vue'
import MessageLoading from '@/components/chatroom/messageLoading.vue'

const listRef = ref<HTMLElement>()
const chatStore = useChatStore()
const loading = ref<boolean>(false)
const { messages, currentSession, tempAssistantMessage, isChatAsyncing } = storeToRefs(chatStore)
const streamChatMsg = computed<ChatMessage>(() => ({
    role: 'assistant',
    content: tempAssistantMessage.value,
    timestamp: ''
} as ChatMessage));

watch(() => currentSession.value, async () => {
    if(currentSession.value[0] != undefined) {
        loading.value = true
        await chatStore.fetchChatHistory(currentSession.value[0])
        loading.value = false
        await chatStore.refreshChatSessionTime(currentSession.value[0])
    }
}, { deep: true })
</script>

<style lang="scss" scoped>
.message-wrapper{
    height: 100%;
    width: 100%;
}

.spin-loading-wrapper{
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
