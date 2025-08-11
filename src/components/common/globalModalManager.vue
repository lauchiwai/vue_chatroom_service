<template>
    <teleport to="body">
        <EnglishWordTipsModal
            v-if="assistantStore.englishWordTipsModalOpen"
            v-model:open="assistantStore.englishWordTipsModalOpen"
            :selected-text="assistantStore.selectedText"
        />
        <EnglishWordAssistantModal
            v-if="assistantStore.englishWordAssistantModalOpen"
            v-model:open="assistantStore.englishWordAssistantModalOpen"
            :selected-text="assistantStore.selectedText"
        />
        <TextLinguisticAssistantModal
            v-if="assistantStore.textLinguisticAssistantModalOpen"
            v-model:open="assistantStore.textLinguisticAssistantModalOpen"
            :selected-text="assistantStore.selectedText"
        />
        <EnglishTTSModal
            v-if="assistantStore.englishTTSModalOpen"
            v-model:open="assistantStore.englishTTSModalOpen"
            :selected-text="assistantStore.selectedText"
        />
    </teleport>
</template>

<script setup lang="ts">
import { useEnglishAssistantStore } from '@/stores/englishAssistantStore';
import EnglishWordTipsModal from '@/components/englishAssistant/modals/englishWordTipsModal.vue';
import EnglishWordAssistantModal from '@/components/englishAssistant/modals/englishWordAssistantModal.vue';
import TextLinguisticAssistantModal from '@/components/englishAssistant/modals/textLinguisticAssistantModal.vue';
import EnglishTTSModal from '@/components/englishAssistant/modals/englishTTSModal.vue';

const assistantStore = useEnglishAssistantStore();
</script>
