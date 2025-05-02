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
import { ref, watch, nextTick, onUnmounted } from 'vue'

const msgContainer = ref<HTMLElement>()
const chatStore = useChatStore()
const isUserInteracting = ref(false)
const { messages, tempAssistantMessage } = storeToRefs(chatStore)

const scrollToBottom = () => {
    if (!msgContainer.value) return;

    const container = msgContainer.value;
    container.style.overflowY = 'hidden';
    void container.offsetHeight;
    container.style.overflowY = 'auto';
    container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
    });
};

watch(() => messages.value, (newValue, oldValue) => { 
    if (oldValue.length === 0 || newValue[newValue.length - 1]?.role === "user") {
        nextTick(() => {
            requestAnimationFrame(() => scrollToBottom());
        });
    }
}, { deep: true, flush: 'post' });

watch(() => tempAssistantMessage.value, () => {
    if ( !isUserInteracting.value ){
        nextTick(() => {
            requestAnimationFrame(() => scrollToBottom());
        });
    }
}, { deep: true, flush: 'post' })

const handleScroll = () => {
    if (!msgContainer.value) return
    
    const { scrollTop, clientHeight, scrollHeight } = msgContainer.value
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50
    
    isUserInteracting.value = !isNearBottom
}

onUnmounted(() => {
     msgContainer.value?.removeEventListener('scroll', handleScroll)
})

nextTick(() => {
    msgContainer.value?.addEventListener('scroll', handleScroll, { passive: true })
})
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

@media (max-width: 768px) {
    .chatroom-container {
        .msg-container {
            padding: 10px 5%;
        }
    }
}
</style>
