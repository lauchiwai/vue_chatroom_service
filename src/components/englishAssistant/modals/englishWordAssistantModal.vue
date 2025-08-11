<template>
    <DraggableResizableModal 
        v-model:open="open"
        :mask="false"
        :css-style="{top:'15vh'}"
        :enable-resize="true"
        :enable-draggable="true"
        :content-padding="'10px'"
    >
        <template #contents>
            <EnglishAssistantLayout :is-mobile="isMobile">
                <template #tool-list>
                    <ChatInputTool 
                        @click="handelShowInputEvent" 
                    />
                </template>
                
                <template #message-list>
                    <EnglishAssistantMessageList />
                </template>
                
                <template #input-area>
                    <WordAssistantInput 
                        v-model:show-input="showChatInput"
                        v-show="showChatInput"
                        :selected-text="englishAssistantStore.selectedText"
                    />
                </template>
            </EnglishAssistantLayout>
        </template>
    </DraggableResizableModal>
</template>

<script setup lang="ts">
import { useScreenStore } from '@/stores/screenStore';
import { computed, watch, onMounted, ref } from 'vue';
import { useEnglishAssistantStore } from '@/stores/englishAssistantStore';
import type { EnglishWordAssistantRequest } from '@/types/englishAssistant/englishAssistant';

import EnglishAssistantMessageList from '@/components/englishAssistant/englishAssistantChatroom/message/englishAssistantMessageList.vue';
import WordAssistantInput from '@/components/englishAssistant/englishAssistantChatroom/input/wordAssistantInput.vue';
import DraggableResizableModal from '@/components/common/modal/draggableResizableModal.vue';
import EnglishAssistantLayout from '@/components/englishAssistant/layout/englishAssistantLayout.vue';
import ChatInputTool from '@/components/englishAssistant/englishAssistantTools/chatInputTool.vue';

const englishAssistantStore = useEnglishAssistantStore();
const open = defineModel('open', { type: Boolean, required: true });
const store = useScreenStore();
const isMobile = computed(() => store.isMobile);
const showChatInput = ref(false);

watch(open, (newVal) => {
    if (newVal) {
        triggerTranslation();
    }
});

const triggerTranslation = () => {
    const selectedText = englishAssistantStore.selectedText;
    if (!selectedText || selectedText.trim().length === 0) return;
    
    const request: EnglishWordAssistantRequest = {
        word: selectedText,
        message: `translate ${selectedText}`
    };
    
    englishAssistantStore.streamEnglishWordAssistant(request);
};

const handelShowInputEvent = () => {
    showChatInput.value = !showChatInput.value;
};

onMounted(() => {
    englishAssistantStore.resetEnglishAssistantStore();
});
</script>
