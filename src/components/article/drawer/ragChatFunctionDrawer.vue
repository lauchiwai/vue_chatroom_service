<template>
    <BaseChatDrawer v-model:open="open">
        <template #create-button="{ closeDrawer }">
            <CreateSessionBnt 
                :collapsed="false" 
                @drawer-close="closeDrawer"
            />
        </template>
        
        <template #history-menu="{ closeDrawer }">
            <RagChatHistoryMenu 
                @drawer-close="closeDrawer"
            />
        </template>
    </BaseChatDrawer>
</template>

<script setup lang="ts">
import { provide, inject, computed } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { useRagStore } from '@/stores/ragStore'
import { ArticleIdKey, ChatHandlersKey } from '@/constants/injectionKeys'

import BaseChatDrawer from '@/components/common/baseChatroom/BasChatDrawer/baseChatDrawer.vue'
import CreateSessionBnt from '@/components/common/baseChatroom/createSessionBnt.vue'
import RagChatHistoryMenu from '@/components/article/menu/ragChatHistoryMenu.vue'

const open = defineModel('open', { type: Boolean, required: true })

const chatStore = useChatStore()
const ragStore = useRagStore()
const articleId = inject(ArticleIdKey, computed(() => 0))

provide(ChatHandlersKey, {
    handleSelect: (sessionId: number) => {
        const id = Number(sessionId)
        if (!isNaN(id)) {
            ragStore.setRagCurrentSession(id)
            open.value = false
        } else {
            console.error('Invalid sessionId:', sessionId)
        }
    },
    handleDelete: async (sessionId: number) => {
        const id = Number(sessionId)
        if (!isNaN(id)) {
            await chatStore.deleteChatData(id)
        } else {
            console.error('Invalid sessionId:', sessionId)
        }
    },
    createSession: async () => {
        await ragStore.createRagChatSession(articleId.value!)
        open.value = false
    },
})
</script>
