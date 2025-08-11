<template>
    <BaseChatMessageList 
        ref="messageListRef"
        :messages="messages"
        :is-chat-asyncing="isChatAsyncing"
        :stream-chat-msg="streamChatMsg"
        :loading="messages.length == 0 && tempAssistantMessage.length == 0"
    >
        <template #empty>
            <EmptyMessage />
        </template>
        
        <template #messages="{ messages }">
            <MessageItem 
                v-for="(msg, index) in messages"
                :key="index"
                :message="msg"
            />
        </template>
        
        <template #loading>
            <MessageLoading />
        </template>
        
        <template #streaming>
            <MessageItem :message="streamChatMsg" />
        </template>
    </BaseChatMessageList>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chatHistory/chatHistory'

import { ref, computed, onMounted, nextTick } from 'vue'
import { useEnglishAssistantStore } from '@/stores/englishAssistantStore'
import { storeToRefs } from 'pinia'

import BaseChatMessageList from '@/components/common/baseChatroom/baseChatMessageList.vue' 
import MessageItem from '@/components/common/baseChatroom/messageItem.vue'
import EmptyMessage from '@/components/common/baseChatroom/emptyMessage.vue'
import MessageLoading from '@/components/common/baseChatroom/messageLoading.vue'

const messageListRef = ref<InstanceType<typeof BaseChatMessageList> | null>(null)
const englishAssistantStore = useEnglishAssistantStore()

const { 
    messages, 
    tempAssistantMessage, 
    isChatAsyncing,
} = storeToRefs(englishAssistantStore)

const streamChatMsg = computed<ChatMessage>(() => ({
    role: 'assistant',
    content: tempAssistantMessage.value,
    timestamp: ''
}))

onMounted(() => {
    nextTick(() => {
        messageListRef.value?.scrollToBottom('auto')
    })
})
</script>
