<template>
    <div class="chatroom-container">
        <div class="msg-container">
            <slot name="message-list"></slot>
        </div>
        <div class="input-container">
            <slot name="input-area"></slot>
        </div>

        <div class="tool-list">
            <slot name="tool-list"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.chatroom-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
    overflow: auto;

    .tool-list{
        position: absolute;
        bottom: 10px;
        right: 10px;
        transition: all 0.2s ease;

        &:hover {
            transform: scale(1.2);
        }

        &:active {
            transform:  scale(0.8);
        }
    }

    .msg-container {
        flex: 1 1 auto; 
        min-height: 0;
        padding-bottom: 10px;
        scroll-behavior: smooth;
        overflow: auto;
        position: relative;
        max-height: 70vh;

        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #c1c1c1;
            border-radius: 4px;
        }
    }

    .input-container {
        width: 100%;
        flex-shrink: 0;
    }
}

/* 响应式样式 */
@media (max-width: 767px) {
    .chatroom-container {
        max-height: 35vh;
    }
}

</style>
