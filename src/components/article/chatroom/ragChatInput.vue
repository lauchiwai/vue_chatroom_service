<template>
    <BaseChatInput 
        :inputText="inputText" 
        :loading="loading"
        @update:inputText="handleInputUpdate"
        @send="handleSend"
        @abort="handleAbort"
    >
        <template #actionTools>
            <a-button @click="handleSummary">
                摘要
            </a-button>
        </template>
    </BaseChatInput>
</template>

<script setup lang="ts">
import type { ChatRequest, SummaryRequest } from '@/types/chat/chat';

import { ref, inject, watch, computed, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores/chatStore';
import { DEFAULTCOLLECTION } from "@/types/article/article";
import { ArticleIdKey } from '@/constants/injectionKeys';

import BaseChatInput from '@/components/common/baseChatroom/baseChatInput.vue'; 

const articleId = inject(ArticleIdKey, computed(() => 0));
watch(articleId, (newId: number | undefined) => {
    if (!newId) console.log('articleId is undefined');
});

const chatStore = useChatStore();
const loading = ref(false);
const { currentSession, inputText } = storeToRefs(chatStore);

enum ChatStat {
    Chat,      
    Summary 
}

const handleInputUpdate = (val: string) => {
    inputText.value = val;
};

const generateNewChatRequest = (): ChatRequest => {
    if (articleId.value) {
        return {
            chat_session_id: currentSession.value[0],
            message: inputText.value.trim(),
            collection_name: DEFAULTCOLLECTION,
            article_id: articleId.value
        };
    }
    return {
        chat_session_id: currentSession.value[0],
        message: inputText.value.trim(),
    };
};

const generateNewSummaryRequest = (): SummaryRequest => ({
    chat_session_id: currentSession.value[0],
    collection_name: DEFAULTCOLLECTION,
    article_id: articleId.value!
});

const handleSend = async () => {
    await handleSteamSend(ChatStat.Chat);
};

const handleSummary = async () => {
    await handleSteamSend(ChatStat.Summary);
};

const handleSteamSend = async (chatStat: ChatStat) => {
    try {
        loading.value = true;

        if (chatStat === ChatStat.Chat && inputText.value.trim().length > 0) {
            const newQuestion = generateNewChatRequest();
            await chatStore.streamChat(newQuestion);
        } else if (chatStat === ChatStat.Summary) {
            const newQuestion = generateNewSummaryRequest();
            await chatStore.streamSummaryChat(newQuestion);
        }

        await chatStore.refreshChatSessionTime(currentSession.value[0]);
    } finally {
        loading.value = false;
    }
};

const handleAbort = () => {
    chatStore.abortStreaming();
};

onUnmounted(() => {
    chatStore.abortStreaming();
});
</script>
