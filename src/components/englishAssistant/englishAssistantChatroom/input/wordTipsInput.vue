<template>
    <BaseChatInput 
        :inputText="inputText" 
        :loading="loading"
        @update:inputText="handleInputUpdate"
        @send="handleSteamSend"
        @abort="handleAbort"
    >
    </BaseChatInput>
</template>

<script setup lang="ts">
import type { EnglishWordAssistantRequest } from '@/types/englishAssistant/englishAssistant';

import { ref, onUnmounted, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEnglishAssistantStore } from '@/stores/englishAssistantStore'

import BaseChatInput from '@/components/common/baseChatroom/baseChatInput.vue'; 

const props = defineProps({
    selectedText: {
        type: String,
        required: true
    },
})

const loading = ref(false);
const englishAssistantStore = useEnglishAssistantStore();
const { inputText } = storeToRefs(englishAssistantStore);

const handleInputUpdate = (val: string) => {
    inputText.value = val;
};

const generateWordTipsRequest = (): EnglishWordAssistantRequest => {
    return {
        word: props.selectedText,
        message: inputText.value.trim(),
    };
};

const handleTipsRequest = (): EnglishWordAssistantRequest => {
    return {
        word: props.selectedText,
        message: `give the tips of ${props.selectedText}`,
    };
};

const handleSteamSend = async () => {
    try {
        loading.value = true;
        const request = generateWordTipsRequest();
        await englishAssistantStore.streamWordTipsService(request);
    } finally {
        loading.value = false;
    }
};

const handleTips = async () => {
    try {
        loading.value = true;
        const request = handleTipsRequest();
        await englishAssistantStore.streamWordTipsService(request);
    } finally {
        loading.value = false;
    }
};

const handleAbort = () => {
    englishAssistantStore.abortStreaming();
};

onMounted(async() =>{
    await handleTips()
})

onUnmounted(() => {
    englishAssistantStore.abortStreaming();
});
</script>
