<template>
    <div class="history-menu-container">
        <a-menu 
            class="custom-menu"
            theme="light"
            mode="inline"
            :selected-keys="selectedKeys"
            @select="handleMenuSelect"
        >   
            <a-menu-item 
                :key="chatSession.sessionId.toString()" 
                v-for="chatSession in chatSessionList"
            >
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
        :delete-fn="handleConfirmDelete"
        :loading="deleteLoading"
    />
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chatStore'
import { ChatHandlersKey } from '@/constants/injectionKeys'
import DeleteModal from '@/components/common/modal/deleteModal.vue'

const injectedHandlers = inject(ChatHandlersKey, {
    handleSelect: (sessionId: number) => {},
    handleDelete: async (sessionId: number) => {}
})

const chatStore = useChatStore()
const { chatSessionList, currentSession } = storeToRefs(chatStore)

const deleteModalOpen = ref(false)
const deleteLoading = ref(false)
const deletingId = ref<number | null>(null)

const selectedKeys = computed(() => {
    return currentSession.value ? [currentSession.value.toString()] : []
})

const showDeleteModal = (id: number) => {
    deletingId.value = id
    deleteModalOpen.value = true
}

const handleConfirmDelete = async () => {
    if (deletingId.value !== null) {
        try {
            deleteLoading.value = true
            await injectedHandlers.handleDelete(deletingId.value)
        } finally {
            deleteLoading.value = false
            deleteModalOpen.value = false
            deletingId.value = null
        }
    }
}

const handleMenuSelect = (info: any) => {
    const sessionId = Number(info.key)
    if (!isNaN(sessionId)) {
        injectedHandlers.handleSelect(sessionId)
    } else {
        console.error('Invalid sessionId from menu selection:', info.key)
    }
}
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
                width: 100%;
                padding: 0 16px;

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
