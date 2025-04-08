<template>
    <button 
        class="create-bnt" 
        @click="createSession"
        :disabled="isLoading"
        :class="{ 'disabled': isLoading }"
    >
        <template v-if="isLoading">
            <LoadingOutlined spin />
        </template>
        <template v-else>
            <PlusSquareOutlined /> 
            <span v-if="!collapsed">開啓新對話</span>
        </template>
    </button>
</template>

<script setup lang="ts">
import { PlusSquareOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { useChatStore } from '@/stores/chatStore'
import { ref } from 'vue'

const chatStore = useChatStore()
const isLoading = ref(false)
const collapsed = defineModel('collapsed', {
    type: Boolean,
    required: true
})

const createSession = async () => {
    try{
        isLoading.value = true
        chatStore.createChatSession()
    } finally {
        isLoading.value = false
    }
    
}
</script>

<style lang="scss" scoped>
.create-bnt{
    height: 45px;
    width: 60%;
    border-radius: 10px;
    border: 0px;
    background-color: #1890ff;
    color: white;
    display: flex;
    align-items: center;
    justify-content:space-around;
    margin: 0 auto;
    font-size: 18px;

    span{
        white-space: nowrap;
        overflow: hidden;
    }

    &:hover{
        background-color:#004B97;
        cursor: pointer;
    }

    &.disabled,
    &[disabled] {
        cursor: not-allowed;
        opacity: 0.65;
    }
}
</style>