<template>
    <div class="history-menu-container">
        <a-menu 
            class="custom-menu"
            theme="light"
            mode="inline"
            :selected-keys="currentSession"
            @select="handleSelect"
            @click="handelClick"
        >   
            <a-menu-item :key="chatSession.sessionId.toString()" v-for="chatSession in chatSessionList">
                <div class="menu-item-container">
                    <span>{{ chatSession.sessionName }}</span>
                    <div class="meun-item-bnt-wrapper">
                        <button @click.stop="showDeleteModal(chatSession.sessionId)"> 
                            <a-tooltip>
                                <template #title>删除</template>
                                <DeleteOutlined /> 
                            </a-tooltip>
                        </button>
                    </div>
                </div>
            </a-menu-item>
        </a-menu>
    </div>

    <DeleteModal 
        v-if="deleteModalOpen"
        v-model:open="deleteModalOpen"
        :delete-fn="handleDelete"
        :loading="deleteLoading"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue';
import { useChatStore } from '@/stores/chatStore';
import { storeToRefs } from 'pinia';

import DeleteModal from '@/components/common/deleteModal.vue';

const emit = defineEmits(['drawer-close']);

const chatStore = useChatStore();
const { chatSessionList, currentSession } = storeToRefs(chatStore);

const deleteModalOpen = ref(false);
const deleteLoading = ref(false);
const deletingId = ref<number | null>(null);

const handleSelect = ({ key }: { key: number }) => {
    chatStore.setCurrentSession(key);
};

const handelClick = () => {
    emit('drawer-close');
};

const showDeleteModal = (id: number) => {
    deletingId.value = id;
    deleteModalOpen.value = true;
};

const handleDelete = async () => {
    if (!deletingId.value) return;
    
    try {
        deleteLoading.value = true;
        await chatStore.deleteChatData(deletingId.value);
    } catch (error) {
        console.error('删除会话失败:', error);
    } finally {
        deleteLoading.value = false;
        deleteModalOpen.value = false;
        deletingId.value = null;
    }
};
</script>

<style lang="scss" scoped>
.history-menu-container{
    height: 100%;

    :deep(.custom-menu) {
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0; 
        overflow-y: auto; 

        .ant-menu-item{
            min-height: 55px; 
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            
            .menu-item-container{
                position: relative;
                height: 100%;

                .meun-item-bnt-wrapper{
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    top: 0;
                    right: 0;
                    display: none;
                    height: 100%;

                    button{
                        border: none;
                        background-color: transparent;
                        padding: 4px 10px;
                        font-size: 18px;
                        cursor: pointer;

                        &:hover {
                            color: red;
                        }
                    }
                }
            }

            &:hover {
                .menu-item-container {
                    .meun-item-bnt-wrapper {
                        display: flex;
                    }
                }
            }
        }

        @media (max-width: 900px) {
            .menu-item-container {
                .meun-item-bnt-wrapper {
                    display: flex !important;
                    opacity: 1 !important;
                }
            }
        }
    }
}
</style>