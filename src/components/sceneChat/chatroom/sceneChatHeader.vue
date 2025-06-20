<template>
    <BaseChatHead>
        <template #left>
            <button class="model-bnt" @click="drawerOpen = true">
                <UnorderedListOutlined />
            </button>
        </template>
        
        <template #right>
        </template>
        
        <template #drawer>
            <SceneChatFunctionDrawer v-model:open="drawerOpen" />
        </template>
    </BaseChatHead>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UnorderedListOutlined } from '@ant-design/icons-vue'
import BaseChatHead from '@/components/common/baseChatroom/baseChatHead.vue'
import SceneChatFunctionDrawer from '@/components/sceneChat/drawer/sceneChatFunctionDrawer.vue'

const drawerOpen = ref(false)
</script>

<style scoped lang="scss">
.model-bnt {
    border: 0px ;
    border-radius: 5px;
    background-color: transparent;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 4px 0;
    min-height: 20px;
    width: 30px;
    cursor: pointer;

    &:hover{
        background-color: #F0F0F0;
        color: gray;
    }

}
</style>
