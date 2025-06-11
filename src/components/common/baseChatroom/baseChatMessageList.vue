<template>
    <div ref="listRef" 
        class="message-wrapper"
        @scroll="handleScroll"
    >
        <template v-if="loading">
            <div class="spin-loading-wrapper">
                <a-spin />
            </div>
        </template>
      
        <template v-else>
            <slot name="empty" v-if="messages.length == 0 && !isChatAsyncing">
                <EmptyMessage />
            </slot>

            <slot name="messages" :messages="messages">
                <MessageItem 
                    v-for="(msg, index) in messages"
                    :key="index"
                    :message="msg"
                />
            </slot>

            <slot name="loading" v-if="isChatAsyncing && !streamChatMsg.content">
                <MessageLoading />
            </slot>

            <slot name="streaming" v-else-if="streamChatMsg.content">
                <MessageItem :message="streamChatMsg" />
            </slot>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chatHistory/chatHistory'

import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

import MessageItem from '@/components/common/baseChatroom/messageItem.vue'
import EmptyMessage from '@/components/common/baseChatroom/emptyMessage.vue'
import MessageLoading from '@/components/common/baseChatroom/messageLoading.vue'

const props = defineProps({
    messages: {
        type: Array as () => ChatMessage[],
        required: true
    },
    isChatAsyncing: {
        type: Boolean,
        required: true
    },
    streamChatMsg: {
        type: Object as () => ChatMessage,
        required: true
    },
    loading: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['scroll'])

const listRef = ref<HTMLElement | null>(null)
const isUserInteracting = ref(false)

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

const handleScroll = (e: Event) => {
    if (!listRef.value) return
    
    const { scrollTop, clientHeight, scrollHeight } = listRef.value
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50
    
    isUserInteracting.value = !isNearBottom
    emit('scroll', e)
}

defineExpose({
    scrollToBottom
})

watch(() => props.messages, (newVal, oldVal) => {
    if (oldVal.length === 0 || newVal[newVal.length - 1]?.role === "user") {
        nextTick(() => {
            requestAnimationFrame(() => scrollToBottom())
        })
    }
}, { deep: true, flush: 'post' })

watch(() => props.streamChatMsg.content, () => {
    if (!isUserInteracting.value) {
        nextTick(() => {
            requestAnimationFrame(() => scrollToBottom())
        })
    }
}, { deep: true, flush: 'post' })

onMounted(() => {
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
