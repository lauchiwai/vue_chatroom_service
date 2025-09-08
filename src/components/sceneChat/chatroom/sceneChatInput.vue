<template>
    <BaseChatInput 
        :inputText="sceneInputText" 
        :loading="loading"
        @update:inputText="handleInputUpdate"
        @send="handleSteamSend"
        @abort="handleAbort"
    >
        <template #actionTools>
        </template>
    </BaseChatInput>
</template>

<script setup lang="ts">
import type { SceneChatRequest } from '@/types/chat/sceneChat';

import { ref, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSceneChatStore } from '@/stores/sceneChatStore'
import { useChatStore } from '@/stores/chatStore'

import BaseChatInput from '@/components/common/baseChatroom/baseChatInput.vue';
 
const sceneChatStore = useSceneChatStore();
const chatStore = useChatStore();
const loading = ref(false);
const { sceneCurrentSession, sceneInputText } = storeToRefs(sceneChatStore);

const handleInputUpdate = (val: string) => {
    sceneInputText.value = val;
};

const generateNewSceneChatRequest = (): SceneChatRequest => {
    return {
        chat_session_id: sceneCurrentSession.value[0],
        message: sceneInputText.value.trim(),
    };
};

const handleSteamSend = async () => {
    if (sceneCurrentSession.value[0] == undefined) {
        console.error("articleId is empty")
        return;
    }
    try {
        loading.value = true;

        const newRequest = generateNewSceneChatRequest();
        await sceneChatStore.streamSceneChat(newRequest);

        await chatStore.refreshChatSessionTime(sceneCurrentSession.value[0]);
    } finally {
        loading.value = false;
    }
};

const handleAbort = () => {
    sceneChatStore.abortStreaming();
};

onUnmounted(() => {
    sceneChatStore.abortStreaming();
});
</script>
