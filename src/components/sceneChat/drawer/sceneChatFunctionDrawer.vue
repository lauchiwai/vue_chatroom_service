<template>
    <BaseChatDrawer v-model:open="open">
        <template #create-button="{ closeDrawer }">
            <createSessionBnt 
                :collapsed="false" 
                @drawer-close="closeDrawer"
            />
        </template>
        
        <template #history-menu="{ closeDrawer }">
            <SceneChatHistoryMenu 
                @drawer-close="closeDrawer"
            />
        </template>
    </BaseChatDrawer>
</template>

<script setup lang="ts">
import type { ChatSessionRequset } from '@/types/chat/chat'

import { provide } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { useSceneChatStore } from '@/stores/sceneChatStore'
import { ChatFunctionsKey, ChatHandlersKey } from '@/constants/injectionKeys'
import { storeToRefs } from 'pinia'

import BaseChatDrawer from '@/components/common/baseChatroom/BasChatDrawer/baseChatDrawer.vue'
import createSessionBnt from '@/components/common/baseChatroom/createSessionBnt.vue'
import SceneChatHistoryMenu from '@/components/sceneChat/menu/sceneChatHistoryMenu.vue'

const open = defineModel('open', { type: Boolean, required: true })

const chatStore = useChatStore()
const sceneChatStore = useSceneChatStore()
const { sceneInputText } = storeToRefs(sceneChatStore);

provide(ChatFunctionsKey, {
    createSession: async () => {
        let newRequrst: ChatSessionRequset ={
            chat_session_name: sceneInputText.value
        } 
        await sceneChatStore.generateSceneChatSession(newRequrst)
        open.value = false
    },
    deleteSession: async (id: number) => {
        await chatStore.deleteChatData(id)
    }
})

provide(ChatHandlersKey, {
    handleSelect: (sessionId: number) => {
        const id = Number(sessionId)
        if (!isNaN(id)) {
            sceneChatStore.setCurrentSession(id)
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
    }
})
</script>
