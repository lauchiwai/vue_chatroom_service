<template>
    <a-drawer
        class="chat-function-drawer"
        v-model:open="open"
        placement="left"
        :body-style="{ padding: '10px 40px' }"
    >
        <div class="create-bnt-container">
            <createSessionBnt :collapsed="false" @drawer-close="handleDrawerClose"/>
        </div>

        <div class="menu-container">
            <chatHistoryMenu @drawer-close="handleDrawerClose"/>
        </div>
    </a-drawer>
</template>

<script setup lang="ts">
import { provide, inject } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { ArticleIdKey, ChatFunctionsKey, ChatHandlersKey } from '@/constants/injectionKeys'
import { computed } from 'vue'

import createSessionBnt from '@/components/common/baseChatroom/createSessionBnt.vue'
import chatHistoryMenu from '@/components/article/menu/ragChatHistoryMenu.vue'

const open = defineModel('open', { type: Boolean, required: true })

const chatStore = useChatStore()
const articleId = inject(ArticleIdKey, computed(() => 0))

const handleDrawerClose = () => {
    open.value = false
}

provide(ChatFunctionsKey, {
    createSession: async () => {
        await chatStore.createRagChatSession(articleId.value!)
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
            chatStore.setCurrentSession(id)
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

<style lang="scss" scoped>
.chat-function-drawer {
    .create-bnt-container {
        height: 10%;
        display: flex;
        align-items: center;
        justify-content: start;
    }

    .bnt-container {
        height: 50px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #f0f0f0;
        border-radius: 4px;

        button {
            border: none;
            border-radius: 2px;
            background-color: transparent;
            font-size: 18px;
            height: 80%;
            width: 80%;
            align-items: center;
            cursor: pointer;

            &:hover {
                background-color: rgb(221, 218, 218);
            }
        }
    }

    .menu-container {
        height: 80%;
    }
}
</style>
