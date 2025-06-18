<template>
    <div class="empty-state-actions">
        <a-button  @click="handleRefresh">
            刷新数据
        </a-button>
        <a-button type="primary" @click="handelAddSelectionModalEvent">
            创建新文章
        </a-button>
    </div>

    <ArticleAddSelectionModal 
        v-if="addSelectionModalOpen"
        v-model:modal-open="addSelectionModalOpen"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ArticleAddSelectionModal from '@/components/article/modals/articleAddSelectionModal.vue';

defineProps<{
    handleRefresh: () => void;
}>();


const addSelectionModalOpen = ref(false);
const handelAddSelectionModalEvent = () => {
    addSelectionModalOpen.value = !addSelectionModalOpen.value;
};
</script>

<style scoped lang="scss">
.empty-state-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 16px;
}
</style>
