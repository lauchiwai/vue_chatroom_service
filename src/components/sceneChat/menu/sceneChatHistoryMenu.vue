<template>
    <BaseChatHistoryMenu 
        :items="sceneChatSessionList"
        :selected-keys="selectedKeys"
        @select="handleMenuSelect"
    >
        <template #item-name="{ item }">
            <span>{{ (item as ChatSessionResponse).sessionName }}</span>
        </template>
        
        <template #item-actions="{ item }">
            <button @click.stop="showDeleteModal((item as ChatSessionResponse).sessionId)"> 
                <a-tooltip>
                    <template #title>删除</template>
                    <DeleteOutlined /> 
                </a-tooltip>
            </button>
        </template>
    </BaseChatHistoryMenu>

    <DeleteModal 
        v-if="deleteModalOpen"
        v-model:open="deleteModalOpen"
        :delete-fn="handleConfirmDelete"
        :loading="deleteLoading"
    />
</template>

<script setup lang="ts">
import type { ChatSessionRequset, ChatSessionResponse } from '@/types/chat/chat'
import { ref, inject, computed } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useSceneChatStore } from '@/stores/sceneChatStore'
import { ChatHandlersKey, ArticleIdKey } from '@/constants/injectionKeys'
import { message } from 'ant-design-vue'

import BaseChatHistoryMenu from '@/components/common/baseChatroom/baseMenu/baseChatHistoryMenu.vue'
import DeleteModal from '@/components/common/modal/deleteModal.vue'

const injectedHandlers = inject(ChatHandlersKey, {
    handleSelect: (sessionId: number) => {},
    handleDelete: async (sessionId: number) => {}
})

const sceneChatStore = useSceneChatStore()
const { sceneChatSessionList, sceneCurrentSession, sceneInputText } = storeToRefs(sceneChatStore)
const deleteModalOpen = ref(false)
const deleteLoading = ref(false)
const deletingId = ref<number | null>(null)

const selectedKeys = computed(() => {
    return sceneCurrentSession.value ? [sceneCurrentSession.value.toString()] : []
})

const showDeleteModal = (id: number) => {
    deletingId.value = id
    deleteModalOpen.value = true
}

const generateSession = async () =>{
    let newReqest: ChatSessionRequset = {
        chat_session_name: sceneInputText.value
    }

     await sceneChatStore.generateSceneChatSession(newReqest);
}

const handleConfirmDelete = async () => {
    if (deletingId.value !== null) {
        try {
            deleteLoading.value = true
            await injectedHandlers.handleDelete(deletingId.value)
            await sceneChatStore.getSceneChatSessionList()
            if (sceneCurrentSession.value.length == 0) {
               await generateSession()
            }
        } finally {
            deleteLoading.value = false
            deleteModalOpen.value = false
            deletingId.value = null
        }
    }
}

const handleMenuSelect = (info: ChatSessionResponse) => {
    console.log("info : ", JSON.stringify(info, null, 4))
    const sessionId = Number(info.sessionId)
    if (!isNaN(sessionId)) {
        injectedHandlers.handleSelect(sessionId)
    } else {
        console.error('Invalid sessionId from menu selection:', info.sessionId)
    }
}
</script>

<style lang="scss" scoped>
:deep(.custom-menu) {
    .ant-menu-item {
        .menu-item-container {
            .meun-item-bnt-wrapper {
                button {
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
    }
}
</style>
