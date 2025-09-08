<template>
    <BaseChatMessageList 
        ref="messageListRef"
        :messages="sceneMessages"
        :is-chat-asyncing="isSceneChatAsyncing"
        :stream-chat-msg="streamChatMsg"
        :loading="loading"
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

import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { useSceneChatStore } from '@/stores/sceneChatStore'
import { useChatStore } from '@/stores/chatStore'
import { storeToRefs } from 'pinia'

import BaseChatMessageList from '@/components/common/baseChatroom/baseChatMessageList.vue' 
import MessageItem from '@/components/common/baseChatroom/messageItem.vue'
import EmptyMessage from '@/components/common/baseChatroom/emptyMessage.vue'
import MessageLoading from '@/components/common/baseChatroom/messageLoading.vue'

const messageListRef = ref<InstanceType<typeof BaseChatMessageList> | null>(null)
const sceneChatStore = useSceneChatStore()
const chatStore = useChatStore()
const loading = ref(false)

const { 
    sceneMessages, 
    sceneCurrentSession, 
    tempAssistantMessage, 
    isSceneChatAsyncing 
} = storeToRefs(sceneChatStore)

const streamChatMsg = computed<ChatMessage>(() => ({
    role: 'assistant',
    content: tempAssistantMessage.value,
    timestamp: ''
}))

watch(() => sceneCurrentSession.value, async (newVal) => {
    if (newVal[0] == undefined) {
        console.error("articleId is empty")
        return;
    }

    loading.value = true
    await sceneChatStore.fetchChatHistory(newVal[0])
    loading.value = false
    await chatStore.refreshChatSessionTime(newVal[0])
    
    nextTick(() => {
        messageListRef.value?.scrollToBottom('auto')
    })
}, { deep: true })

onMounted(() => {
    nextTick(() => {
        messageListRef.value?.scrollToBottom('auto')
    })
})
</script>
