<template>
    <div class="chatroom-container">
        <div class="chat-header">
            <SceneChatHeader />
        </div>
        <div class="msg-container">
            <div class="msg-content">
                <SceneMessageList />
            </div>
        </div>
        <div class="input-container">
            <SceneChatInput />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChatSessionRequset } from '@/types/chat/chat'
import { useSceneChatStore } from '@/stores/sceneChatStore'
import { storeToRefs } from 'pinia'

import SceneChatHeader from '@/components/sceneChat/chatroom/sceneChatHeader.vue'
import SceneMessageList from '@/components/sceneChat/chatroom/sceneMessageList.vue'
import SceneChatInput from '@/components/sceneChat/chatroom/sceneChatInput.vue'
import { onMounted } from 'vue'

const sceneChatStore = useSceneChatStore();
const { sceneCurrentSession, sceneInputText } = storeToRefs(sceneChatStore);

onMounted(async() =>{
    await sceneChatStore.getSceneChatSessionList();

    if (sceneCurrentSession.value.length == 0){
        let newRequest: ChatSessionRequset = {
            chat_session_name : sceneInputText.value
        }

        await sceneChatStore.generateSceneChatSession(newRequest);
    }
})
</script>

<style lang="scss" scoped>
.chatroom-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;

    .chat-header {
        height: 40px;
        flex-shrink: 0;
    }

    .msg-container {
        flex: 1;
        overflow: hidden;
        display: flex;
        justify-content: center;
        padding: 0 20px;
        
        .msg-content {
            width: 60vw;
            max-width: 1200px;
            height: 100%;
            overflow-y: auto;
        
            scrollbar-width: thin; 
            scrollbar-color: #c1c1c1 #f5f5f5; 
            
            &::-webkit-scrollbar {
                width: 8px;
                height: 8px; 
            }
            &::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
                &:hover { background: #a8a8a8; }
            }
            &::-webkit-scrollbar-track {
                background: #f5f5f5;
                border-radius: 4px;
                margin: 2px 0;
            }
            @media (max-width: 768px) {
                width: 100vw;
            }
        }
    }

    .input-container {
        flex-shrink: 0;
    }
}
</style>
