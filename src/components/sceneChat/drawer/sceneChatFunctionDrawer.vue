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
    
    <ScenarioDialogModal 
        v-model:modalOpen="configModalOpen" 
        @submit="handleConfigSubmit"
    />
</template>

<script setup lang="ts">
import type { ChatSessionRequset } from '@/types/chat/chat'

import { ref, provide, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ChatHandlersKey } from '@/constants/injectionKeys'
import { useSceneChatStore } from '@/stores/sceneChatStore'
import { useChatStore } from '@/stores/chatStore'

import ScenarioDialogModal from '@/components/sceneChat/modal/scenarioDialogModal.vue'
import createSessionBnt from '@/components/common/baseChatroom/createSessionBnt.vue'
import SceneChatHistoryMenu from '@/components/sceneChat/menu/sceneChatHistoryMenu.vue'
import BaseChatDrawer from '@/components/common/baseChatroom/BasChatDrawer/baseChatDrawer.vue'

const open = defineModel('open', { type: Boolean, required: true })
const configModalOpen = ref(false)
const sceneChatStore = useSceneChatStore()
const chatStore = useChatStore()

const { sceneChatSessionList } = storeToRefs(sceneChatStore)
watch(sceneChatSessionList, (newList) => {
    if (newList.length == 0) {
        configModalOpen.value = true;
    }
}, { deep: true, immediate: true });

provide(ChatHandlersKey, {
    handleSelect: (session: number) => {
        if (session) {
            sceneChatStore.setCurrentSession(session)
            open.value = false
        }
    },
    
    handleDelete: async (sessionId: number) => {
        const id = Number(sessionId)
        if (!isNaN(id)) {
            await chatStore.deleteChatData(id)
            await sceneChatStore.getSceneChatSessionList()
            open.value = false
        }
    },
    
    createSession: async () => {
        configModalOpen.value = true
        open.value = false
    },
})

const handleConfigSubmit = async (configData: any) => {
    const sessionName = `${configData.scene}|${configData.userRole}|${configData.aiRole}`
    
    const newRequest: ChatSessionRequset = {
        chat_session_name: sessionName,
    }
    
    await sceneChatStore.generateSceneChatSession(newRequest);
    await sceneChatStore.initSceneChat(sessionName)
    open.value = false
}
</script>
