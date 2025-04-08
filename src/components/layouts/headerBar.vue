<template>
    <a-layout-header class="header">
        <component
            :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
            class="trigger"
            @click="handleToggle"
        />
        <div class="header-right">
            <a-button type="text" >
                <template #icon><UserOutlined /></template>
                <span>
                    {{ userName }}
                </span>
            </a-button>
        </div>
    </a-layout-header>
</template>

<script setup lang="ts">
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons-vue'
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

    .header-right {
        display: flex;
        gap: 16px;
    }
}
</style>