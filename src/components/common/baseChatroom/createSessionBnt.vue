<template>
    <button 
        class="create-bnt" 
        @click="handleCreate"
        :disabled="isLoading"
        :class="{ 'disabled': isLoading }"
    >
        <template v-if="isLoading">
            <LoadingOutlined spin />
        </template>
        <template v-else>
            <PlusSquareOutlined /> 
            <span>開啓新對話</span>
        </template>
    </button>
</template>

<script setup lang="ts">
import { PlusSquareOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { ref, inject } from 'vue'
import { ChatFunctionsKey } from '@/constants/injectionKeys'

const functions = inject(ChatFunctionsKey, {})
const createSession = functions.createSession || (async () => {})

const isLoading = ref<boolean>(false)

const handleCreate = async () => {
  try {
    isLoading.value = true
    await createSession()
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
