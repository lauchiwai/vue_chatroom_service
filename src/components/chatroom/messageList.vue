<template>
    <div ref="listRef">
        <MessageItem 
            v-for="(msg, index) in messages"
            :key="index"
            :message="msg"
        />
    </div>
</template>
  
<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { storeToRefs } from 'pinia'

import MessageItem from '@/components/chatroom/messageItem.vue'

const listRef = ref<HTMLElement>()
const chatStore = useChatStore()

const { messages, currentSession } = storeToRefs(chatStore)

watch(() => currentSession.value, async () => {
    if(currentSession.value[0] != undefined) {
        await chatStore.fetchChatHistory(currentSession.value[0])
    }
}, { deep: true })

watch(() => messages, async () => {
    await nextTick()
    if (listRef.value) {
        listRef.value.scrollTop = listRef.value.scrollHeight
    }
}, { deep: true })
</script>
