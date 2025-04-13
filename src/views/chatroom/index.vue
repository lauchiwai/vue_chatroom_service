<template>
    <div class="chatroom-container">
        <div class="msg-container" ref="msgContainer">
            <messageList />
        </div>
        <div class="input-container">
            <chatInput />
        </div>
    </div>
</template>

<script setup lang="ts">
import messageList from '@/components/chatroom/messageList.vue'
import chatInput from '@/components/chatroom/chatInput.vue'

import { useChatStore } from '@/stores/chatStore'
import { storeToRefs } from 'pinia'
import { ref, watch, nextTick } from 'vue'

const msgContainer = ref<HTMLElement>()
const chatStore = useChatStore()
const { messages, tempAssistantMessage } = storeToRefs(chatStore)

const scrollToBottom = () => {
    nextTick(() => {
        if (msgContainer.value) {
            msgContainer.value.scrollTop = msgContainer.value.scrollHeight
        }
    })
}

watch(() => [...messages.value, tempAssistantMessage.value], () => scrollToBottom(),
  { deep: true, flush: 'post' }
)
</script>

<style lang="scss" scoped>
.chatroom-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .msg-container{
        flex: 1;
        padding: 10px 10%;
        scroll-behavior: smooth;
        overflow-y: scroll;
    }
}
</style>
