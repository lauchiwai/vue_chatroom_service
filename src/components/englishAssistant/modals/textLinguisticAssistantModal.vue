<template>
    <DraggableResizableModal 
        v-if="open"
        v-model:open="open"
        :mask="false"
        :css-style="{top:'5vh'}"
        :enable-resize="true"
        :enable-draggable="true"
        :contentPadding="'10px'"
    >
        <template #contents>
            <EnglishAssistantLayout :is-mobile="isMobile">
                <template #tool-list>
                    <ChatInputTool 
                    />
                </template>
                
                <template #message-list>
                    <EnglishAssistantMessageList />
                </template>
                
                <template #input-area>
                    <TextLinguisticAssistantInput 
                        v-model:show-input="showChatInput"
                        v-show="showChatInput"
                        v-if="text.trim().length > 0"
                        :selected-text="text"
                    />
                </template>
            </EnglishAssistantLayout>
        </template>
    </DraggableResizableModal>
</template>

<script setup lang="ts">
import { useScreenStore } from '@/stores/screenStore';
import { computed, watchEffect, onBeforeMount, ref } from 'vue';
import { useEnglishAssistantStore } from '@/stores/englishAssistantStore';

import EnglishAssistantMessageList from '@/components/englishAssistant/englishAssistantChatroom/message/englishAssistantMessageList.vue';
import TextLinguisticAssistantInput from '@/components/englishAssistant/englishAssistantChatroom/input/textLinguisticAssistantInput.vue';
import DraggableResizableModal from '@/components/common/modal/draggableResizableModal.vue';
import EnglishAssistantLayout from '@/components/englishAssistant/layout/englishAssistantLayout.vue'; // 新增导入
import ChatInputTool from '@/components/englishAssistant/englishAssistantTools/chatInputTool.vue';

const englishAssistantStore = useEnglishAssistantStore();

const props = defineProps({
    selectedText: {
        type: String,
        required: true
    },
});

const open = defineModel('open', { type: Boolean, required: true });
const store = useScreenStore();
const isMobile = computed(() => store.isMobile);
const showChatInput = ref(false);
const text = ref('')

const handelShowInputEvent = () => {
    showChatInput.value = !showChatInput.value;
};

watchEffect(() => {
    const trimmedText = props.selectedText.trim();
    if (trimmedText.length > 0) {
        text.value = props.selectedText;
    }
});

onBeforeMount(() => {
    englishAssistantStore.resetEnglishAssistantStore();
});
</script>

<style lang="scss" scoped>
.chatroom-container {
    height: 70vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;

    .msg-container {
        flex: 1;
        padding-bottom: 10px;
        scroll-behavior: smooth;
        overflow: auto;
    }

    .input-container {
        width: 100%;
    }
}

@media (max-width: 768px) {
    .chatroom-container {
        height: 70vh !important;
    }
}
</style>
