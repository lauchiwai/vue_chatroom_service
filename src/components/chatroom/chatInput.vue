<template>
    <div class="chat-input-container">
        <div class="input-wrapper">
            <a-textarea
                v-model:value="inputText"
                placeholder="有什麼我可以幫助你的嗎？"
                :auto-size="{ minRows: 1, maxRows: 6 }"
                @pressEnter="handleSteamSend(ChatStat.Chat)"
                :disabled="loading"
                class="chat-textarea"
            />
            <div class="action-tools-wrapper">
                <div  class="action-tools">
                    <a-button @click="handleSteamSend(ChatStat.Summary)">
                        獲取摘要
                    </a-button>
                </div>

                <a-tooltip :title="!inputText.trim() ? '請輸入内容' :'發送'" v-if="!loading">
                    <a-button
                        type="primary"
                        shape="circle"
                        class="send-button"
                        :disabled="!inputText.trim()"
                        :loading="loading"
                        @click="handleSteamSend(ChatStat.Chat)"
                    >
                        <template #icon><SendOutlined /></template>
                    </a-button>
                </a-tooltip>

                <a-tooltip title="停止" v-else>
                    <a-button
                        type="primary"
                        shape="circle"
                        class="send-button"
                        @click="chatStore.abortStreaming"
                    >
                        <template #icon><BorderOutlined /></template>
                    </a-button>
                </a-tooltip>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import type { ChatRequest, SummaryRequest } from '@/types/chat/chat'

import { SendOutlined, BorderOutlined } from '@ant-design/icons-vue'
import { useChatStore } from '@/stores/chatStore'
import { useUserStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { DEFAULTCOLLECTION } from "@/types/article/article";
import { ref, inject, watch, computed, onUnmounted } from 'vue'
import { ArticleIdKey } from '@/constants/injectionKeys'

const articleId = inject(ArticleIdKey, computed(() => 0 ))
watch(articleId, ( newId: number | undefined ) => {
    if (!newId)
        console.log('articleId is undefine:')
})

const chatStore = useChatStore()
const userStore = useUserStore()
const loading = ref(false)
const { currentSession, inputText } = storeToRefs(chatStore)

enum ChatStat {
    Chat,      
    Summary 
}

const generateNewChatRequest = () =>{
    if (articleId.value) {
        return {
            chat_session_id: currentSession.value[0],
            user_id: userStore.userId,
            message: inputText.value.trim(),
            collection_name: DEFAULTCOLLECTION,
            article_id: articleId.value
        } as ChatRequest

    }
    else {
        return {
            chat_session_id: currentSession.value[0],
            user_id: userStore.userId,
            message: inputText.value.trim(),
        } as ChatRequest
    }
}

const generateNewSummaryRequest = () =>{
    return {
        chat_session_id: currentSession.value[0],
        user_id: userStore.userId,
        collection_name: DEFAULTCOLLECTION,
        article_id: articleId.value
    } as SummaryRequest
}

const handleSteamSend = async (chatStat :ChatStat) => {
    try {
        loading.value = true

        if (!userStore.userId) {
            message.error("userId is UNKNOW")
            return
        }

        if (chatStat == ChatStat.Chat && inputText.value.trim().length > 0){
            let newQusetion: ChatRequest = generateNewChatRequest();
            await chatStore.streamChat(newQusetion)
        } else if (chatStat == ChatStat.Summary) {
            let newQusetion: SummaryRequest = generateNewSummaryRequest();
            await chatStore.streamSummaryChat(newQusetion)
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

    .action-tools-wrapper {
        width: 100%;
        height: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
    }

    .action-tools{
        display: flex;
        gap: 10px;
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