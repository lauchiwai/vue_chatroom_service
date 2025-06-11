<template> 
    <DraggableResizableModal 
        v-if="open"
        v-model:open="open"
        :mask="isMobile"
        :css-style="{top:'5vh'}"
        :enable-resize="!isMobile"
        :enable-draggable="!isMobile"
    >
        <template #contents>
            <div class="chatroom-container">
                <div class="msg-container">
                    <EnglishAssistantMessageList />
                </div>
                <div class="input-container">
                    <WordAssistantInput 
                        :selected-text="selectedText"
                    />
                </div>
             </div>
        </template>
    </DraggableResizableModal>
</template>

<script setup lang="ts">
import { useScreenStore } from '@/stores/screenStore'
import { computed, onBeforeMount } from 'vue'
import { useEnglishAssistantStore } from '@/stores/englishAssistantStore'

import EnglishAssistantMessageList from '@/components/englishAssistant/englishAssistantChatroom/englishAssistantMessageList.vue'
import WordAssistantInput from '@/components/englishAssistant/englishAssistantChatroom/wordAssistantInput.vue'
import DraggableResizableModal from '@/components/common/modal/draggableResizableModal.vue'

const englishAssistantStore = useEnglishAssistantStore()

const props = defineProps({
    selectedText: {
        type: String,
        required: true
    },
})

const open = defineModel('open', { type: Boolean, required: true })
const store = useScreenStore()
const isMobile = computed(() => store.isMobile)
onBeforeMount(()=>{
    englishAssistantStore.resetEnglishAssistantStore()
})
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
        padding: 10px 10%;
        scroll-behavior: smooth;
        overflow: auto;
    }

    .input-container{
        width: 100%;
    }
}

@media (max-width: 768px) {
    .chatroom-container {
        height: 70vh !important;
        .msg-container {
            padding: 10px 5%;
        }
    }
}
</style>
