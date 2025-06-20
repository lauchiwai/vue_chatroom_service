<template>
    <BaseChatInput 
        :inputText="ragInputText" 
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
import type { RagChatRequest, SummaryRequest } from '@/types/chat/rag';

import { ref, inject, watch, computed, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRagStore } from '@/stores/ragStore'
import { useChatStore } from '@/stores/chatStore'
import { DEFAULTCOLLECTION } from "@/types/article/article";
import { ArticleIdKey } from '@/constants/injectionKeys';
import { message } from 'ant-design-vue';

import BaseChatInput from '@/components/common/baseChatroom/baseChatInput.vue'; 

const articleId = inject(ArticleIdKey, computed(() => 0));
watch(articleId, (newId: number | undefined) => {
    if (!newId) console.log('articleId is undefined');
});

const ragStore = useRagStore();
const chatStore = useChatStore();
const loading = ref(false);
const { ragCurrentSession, ragInputText } = storeToRefs(ragStore);

enum ChatStat {
    Chat,      
    Summary 
}

const handleInputUpdate = (val: string) => {
    ragInputText.value = val;
};

const generateNewChatRequest = (): RagChatRequest => {
    return {
        chat_session_id: ragCurrentSession.value[0],
        message: ragInputText.value.trim(),
        collection_name: DEFAULTCOLLECTION,
        article_id: articleId.value!
    };
};

const generateNewSummaryRequest = (): SummaryRequest => ({
    chat_session_id: ragCurrentSession.value[0],
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
    if (! articleId.value) {
            message.error("articleId is empty")
            return;
    }
    try {
        loading.value = true;

        if (chatStat === ChatStat.Chat && ragInputText.value.trim().length > 0) {
            const newQuestion = generateNewChatRequest();
            await ragStore.streamChat(newQuestion);
        } else if (chatStat === ChatStat.Summary) {
            const newQuestion = generateNewSummaryRequest();
            await ragStore.streamSummaryChat(newQuestion);
        }

        await chatStore.refreshChatSessionTime(ragCurrentSession.value[0]);
    } finally {
        loading.value = false;
    }
};

const handleAbort = () => {
    ragStore.abortStreaming();
};

onUnmounted(() => {
    ragStore.abortStreaming();
});
</script>
