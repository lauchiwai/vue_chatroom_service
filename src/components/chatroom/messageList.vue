<template>
    <div 
        ref="listRef" 
        class="message-wrapper"
        @scroll="handleScroll"
    >
        <template v-if="loading">
            <div class="spin-loading-wrapper">
                <a-spin />
            </div>
        </template>
      
        <template v-else>
            <EmptyMessage 
                v-if="messages.length == 0 && !isChatAsyncing"
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
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { storeToRefs } from 'pinia'

import MessageItem from '@/components/chatroom/messageItem.vue'
import EmptyMessage from '@/components/chatroom/emptyMessage.vue'
import MessageLoading from '@/components/chatroom/messageLoading.vue'

const listRef = ref<HTMLElement | null>(null)
const chatStore = useChatStore()
const loading = ref(false)
const isUserInteracting = ref(false)

const { 
    messages, 
    currentSession, 
    tempAssistantMessage, 
    isChatAsyncing 
} = storeToRefs(chatStore)

const streamChatMsg = computed<ChatMessage>(() => ({
    role: 'assistant',
    content: tempAssistantMessage.value,
    timestamp: ''
}))

const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (!listRef.value) return

    listRef.value.style.overflowY = 'hidden'
    void listRef.value.offsetHeight
    listRef.value.style.overflowY = 'auto'
    
    listRef.value.scrollTo({
        top: listRef.value.scrollHeight,
        behavior
    })
}

const handleScroll = () => {
    if (!listRef.value) return
    
    const { scrollTop, clientHeight, scrollHeight } = listRef.value
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50
    
    isUserInteracting.value = !isNearBottom
}

watch(() => messages.value, (newVal, oldVal) => {
    if (oldVal.length === 0 || newVal[newVal.length - 1]?.role === "user") {
        nextTick(() => {
            requestAnimationFrame(() => scrollToBottom())
        })
    }
}, { deep: true, flush: 'post' })

watch(() => tempAssistantMessage.value, () => {
    if (!isUserInteracting.value) {
        nextTick(() => {
            requestAnimationFrame(() => scrollToBottom())
        })
    }
}, { deep: true, flush: 'post' })

watch(() => currentSession.value, async (newVal) => {
    if (newVal[0] !== undefined) {
        loading.value = true
        await chatStore.fetchChatHistory(newVal[0])
        loading.value = false
        await chatStore.refreshChatSessionTime(newVal[0])
        
        nextTick(() => {
            requestAnimationFrame(() => scrollToBottom('auto'))
        })
    }
}, { deep: true })

onMounted(() => {
    listRef.value?.addEventListener('scroll', handleScroll, { passive: true })
    nextTick(() => {
        requestAnimationFrame(() => scrollToBottom('auto'))
    })
})

onUnmounted(() => {
    listRef.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.message-wrapper {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 8px 0;
}

.spin-loading-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
