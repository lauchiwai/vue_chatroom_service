<template>
    <div class="chat-input-container">
        <div class="input-wrapper">
            <a-textarea
                v-model:value="inputText"
                placeholder="有什麼我可以幫助你的嗎？"
                :auto-size="{ minRows: 1, maxRows: 6 }"
                @pressEnter="handleSteamSend"
                :disabled="loading"
                class="chat-textarea"
            />
            <div class="action-buttons">
                <a-tooltip :title="!inputText.trim() ? '請輸入内容' :'發送'">
                    <a-button
                        type="primary"
                        shape="circle"
                        class="send-button"
                        :disabled="!inputText.trim()"
                        :loading="loading"
                        @click="handleSteamSend"
                    >
                        <template #icon><SendOutlined /></template>
                    </a-button>
                </a-tooltip>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import type { ChatRequest } from '@/types/chat/chatSession'

import { SendOutlined } from '@ant-design/icons-vue'
import { useChatStore } from '@/stores/chatStore'
import { useUserStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { ref, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'

const chatStore = useChatStore()
const userStore = useUserStore()
const loading = ref(false)
const { currentSession, inputText } = storeToRefs(chatStore)

const generateNewQuestion = () =>{
    return {
        chat_session_id: currentSession.value[0],
        user_id: userStore.userId,
        message: inputText.value.trim(),
        collection_name: "string"
    } as ChatRequest
}

// const handleChat = async () => {
//     try {
//         loading.value = true
//         if (!userStore.userId) {
//             message.error("userId is UNKNOW")
//             return
//         }
//         if (inputText.value.trim()) {
//             let newQusetion : ChatRequest = generateNewQuestion();

//             await chatStore.chat(newQusetion);
//         }
//     } finally {
//         loading.value = false
//     }
// }

const handleSteamSend = async () => {
    try {
        loading.value = true

        if (!userStore.userId) {
            message.error("userId is UNKNOW")
            return
        }

        if (inputText.value.trim()) {
            let newQusetion : ChatRequest = generateNewQuestion();

            await chatStore.steamChat(newQusetion)
        }

        await chatStore.refreshChatSessionTime(currentSession.value[0])
    } finally {
        loading.value = false
    }
}

onUnmounted(() => {
    chatStore.abortStreaming()
})

</script>

<style lang="scss" scoped>
.chat-input-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    margin-bottom: 10px;
    padding: 16px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    
    &::before {
        content: "";
        position: absolute;
        top: -20px;  
        left: 0;
        right: 0;
        height: 40px;
        background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.1) 0%,    
            rgba(255, 255, 255, 0.8) 100%  
        );
        pointer-events: none;  
        z-index: -1;          
    }

    .input-wrapper {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.3s;
        padding: 5px 10px;
    
        &:focus-within {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
    }

    .chat-textarea {
        width: 100%;
        border: none;
        resize: none;
        padding: 12px 16px;
        font-size: 16px;
        line-height: 1.5;
        min-height: 56px;
        max-height: 200px;
        box-shadow: none !important;
    
        &:focus {
            box-shadow: none !important;
        }
    }

    .action-buttons {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: end;
    }

    .send-button {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1890ff;
        border: none;
        transition: all 0.2s;
    
        &:hover {
            background-color: #40a9ff;
            transform: scale(1.05);
        }
    
        &:active {
            transform: scale(0.95);
        }
    
        &[disabled] {
            background-color: #d9d9d9;
            cursor: not-allowed;
        }
    }
}
</style>