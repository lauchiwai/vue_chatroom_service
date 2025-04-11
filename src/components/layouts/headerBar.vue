<template>
    <a-layout-header class="header">
        <component
            :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
            class="trigger"
            @click="handleToggle"
        />
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
</template>

<script setup lang="ts">
import { 
    MenuUnfoldOutlined, 
    MenuFoldOutlined, 
    UserOutlined, 
    DownOutlined, 
    LogoutOutlined 
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/authStore'
import { ref, computed } from 'vue'

const userStore = useUserStore()
const userName = computed(() => userStore.userName)
const collapsed = defineModel('collapsed', {
    type: Boolean,
    required: true
})

const handleToggle = () => {
    collapsed.value = !collapsed.value
}

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

    .trigger {
        font-size: 18px;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
            color: #1890ff;
        }
    }

    .user-wrapper{  
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
}
</style>