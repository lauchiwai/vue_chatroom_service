<template>
    <div class="history-menu-container">
        <a-menu class="custom-menu"
            theme="light"
            mode="inline"
            :selected-keys="currentSession"
            @select="handleSelect"
        >   
            <a-menu-item :key="chatSession.sessionId.toString()" v-for="chatSession in chatSessionList">
                <div class="menu-item-container">
                    <span>{{ chatSession.sessionName }}</span>
                    <div class="meun-item-bnt-wrapper">
                        <button @click="showDeleteModal(chatSession.sessionId)"> 
                            <a-tooltip>
                                <template #title>刪除</template>
                                <DeleteOutlined /> 
                            </a-tooltip>
                        </button>
                    </div>
                </div>
            </a-menu-item>
        </a-menu>
    </div>

    <DeleteModal ref="deleteModalRef"
        :deleteFn="handleDelete"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { useChatStore } from '@/stores/chatStore'
import { storeToRefs } from 'pinia'

import DeleteModal from '@/components/common/DeleteModal.vue'

onMounted(async () => {
    await chatStore.fetchChatSessionList()
})

const deletingId = ref('');
const deleteModalRef = ref();
const chatStore = useChatStore()
const { chatSessionList, currentSession } = storeToRefs(chatStore)

const handleSelect = ({ key }: { key: string }) => {
    chatStore.setCurrentSession(key)
}

const showDeleteModal = (id: string) => {
    deleteModalRef.value.open();
    deletingId.value = id;
};

const handleDelete = async () => {
    if (!deletingId.value) return;
    await chatStore.deleteChatData(deletingId.value);
    deletingId.value = '';
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
    }
}
</style>