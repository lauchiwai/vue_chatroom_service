<template>
    <div class="chatroom-container">
        <div class="chat-header">
            <chatHeader />
        </div>
        <div class="msg-container">
            <messageList />
        </div>
        <div class="input-container">
            <chatInput />
        </div>
    </div>
</template>

<script setup lang="ts">
import messageList from '@/components/article/chatroom/ragMessageList.vue'
import chatInput from '@/components/article/chatroom/ragChatInput.vue'
import chatHeader from '@/components/article/chatroom/ragChatHeader.vue'
</script>

<style lang="scss" scoped>
.chatroom-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .chat-header {
        height: 40px;
        flex-shrink: 0;
    }

    .msg-container {
        flex: 1;
        overflow: hidden; 
    }

    .input-container {
        flex-shrink: 0;
    }
}
</style>
