<template>
    <header class="mobile-header">
        <div class="header-title" v-if="title">{{ title }}</div>
        <button class="menu-button" @click="toggleMenu">
            <span class="menu-text">menu</span>
        </button>
        <div v-if="menuOpen" class="mobile-menu">
            <div 
                v-for="item in store.items" 
                :key="item.key"
                class="menu-item"
                :class="{ active: store.selectedKeys.includes(item.key) }"
                @click="handleItemClick(item)"
            >
                <component :is="item.icon()" class="menu-icon" />
                <span class="menu-label">{{ item.label }}</span>
            </div>
        </div>
        <SettingModal 
            v-if="store.settingOpen"
            v-model:setting-open="store.settingOpen"
        />
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MenuOutlined } from '@ant-design/icons-vue'
import { useSiderStore, type MenuItem } from '@/stores/siderStore'
import SettingModal from '@/components/layouts/modal/settingModal.vue'

const props = defineProps({
    title: {
        type: String,
        default: ''
    }
})

const store = useSiderStore()
const menuOpen = ref(false)

const handleItemClick = (item: MenuItem) => {
    store.setSelectedKeys([item.key])
    store.selectEvent()
    menuOpen.value = false
}

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
}
</script>

<style scoped lang="scss">
.mobile-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 16px;
    height: 40px;
}

.header-title {
    font-size: 18px;
    font-weight: 500;
}

.menu-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 6px;
    border-radius: 5px;
    background-color: 	#D0D0D0;

    .menu-text {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        font-size: 14px;
        font-weight: 800;
        color: gray;
    }
}

.mobile-menu {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 999;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 12px;
    border-bottom: 1px solid #f0f0f0;
}

.menu-item.active {
    color: #1890ff;
    background-color: #e6f7ff;
}

.menu-icon {
    font-size: 18px;
}

.menu-label {
    font-size: 16px;
}
</style>
