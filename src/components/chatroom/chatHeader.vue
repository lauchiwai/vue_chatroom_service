<template>
    <a-layout-header class="header">
        <div class="header-left">
            <button class="model-bnt" @click="drawerOpen=true">
                <UnorderedListOutlined />
            </button>
        </div>

        <div class="header-right">
        </div>
    </a-layout-header>

    <chatFunctionDrawer 
        v-model:open="drawerOpen"
    />
</template>

<script setup lang="ts">
import { UnorderedListOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

import chatFunctionDrawer from '@/components/chatroom/drawer/chatFunctionDrawer.vue'

const drawerOpen = ref<boolean>(false)
</script>

<style lang="scss" scoped>
.header {
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left{
        height: 100%;
        display: flex;
        align-items: center;

        .model-bnt{
            border: 0px ;
            border-radius: 5px;
            background-color: transparent;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            width: 40px;
            cursor: pointer;

            &:hover{
                background-color: gray;
                color: white;
            }

        }
    }

    .header-right {
        display: flex;
        gap: 16px;
    }
}
</style>