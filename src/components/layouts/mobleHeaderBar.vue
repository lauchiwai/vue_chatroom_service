<template>
    <a-layout-header class="header">
        <div class="header-left">
            <button class="model-bnt" @click="drawerOpen=true">
                <UnorderedListOutlined />
            </button>
        </div>

        <div class="header-right">
            <a-dropdown>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="logout" @click="handleLogout">
                            <LogoutOutlined /> 登出
                        </a-menu-item>
                    </a-menu>
                </template>
                <div class="user-wrapper">
                    <UserOutlined />
                    <span> {{ userName }} </span>
                    <DownOutlined style="font-size: 10px; margin-left: 4px;" />
                </div>
            </a-dropdown>
        </div>
    </a-layout-header>


    <chatFunctionDrawer 
        v-model:open="drawerOpen"
    />
</template>

<script setup lang="ts">
import { UnorderedListOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/authStore'
import { ref, computed } from 'vue'

import chatFunctionDrawer from '@/components/layouts/drawer/chatFunctionDrawer.vue'

const userStore = useUserStore()
const userName = computed(() => userStore.userName)
const drawerOpen = ref(false)

const handleLogout = () =>{
    userStore.logout()
    window.location.href = '/login'
}
</script>

<style lang="scss" scoped>
.header {
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 24px;
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
            background-color: white;
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