<template>
    <BinaryChoiceModal 
        v-if="modalOpen"
        v-model:modal-open="modalOpen"
    >
        <template #left-button>
            <AICreateButton @click="handleAIClick" />
        </template>

        <template #right-button>
            <UploadButton @click="handleUploadClick" />
        </template>
    </BinaryChoiceModal>
</template>

<script lang="ts" setup>
import { ROUTE_NAMES } from '@/router';
import { useRouter } from 'vue-router';

import BinaryChoiceModal from '@/components/common/modal/binaryChoiceModal.vue';
import AICreateButton from '@/components/article/buttons/aICreateButton.vue';
import UploadButton from '@/components/article/buttons/uploadButton.vue';

const router = useRouter();
const modalOpen = defineModel('modalOpen', { type: Boolean, required: true });

const handleAIClick = () => {
    router.push({ name: ROUTE_NAMES.BookShelf_AiGenerater });
};

const handleUploadClick = () => {
    router.push({ name: ROUTE_NAMES.BookShelf_File_Upload });
};
</script>

<style lang="scss" scoped>
</style>
