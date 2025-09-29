<template>
    <header class="mobile-header">
        <div class="header-title" v-if="title">{{ title }}</div>
        <button class="menu-button" @click.stop="toggleMenu" ref="menuButtonRef">
            <AppstoreOutlined />
        </button>
        <div v-if="menuOpen" class="mobile-menu" ref="menuRef">
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
import { AppstoreOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, onBeforeUnmount } from 'vue'
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
const menuButtonRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    if (!menuOpen.value) return
    
    const clickedMenu = menuRef.value?.contains(event.target as Node)
    const clickedButton = menuButtonRef.value?.contains(event.target as Node)
    
    if (!clickedMenu && !clickedButton) {
        menuOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

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
    background: linear-gradient(145deg, #e0e0e0, #d0d0d0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 16px;
    height: 32px;
}

.header-title {
    font-size: 18px;
    font-weight: 500;
    color: #555;
    margin-right: auto;
}

.menu-button {
    background-color: #D0D0D0;
    border: none;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
        background: #8E8E8E;
        color: #D0D0D0;
        border: none;
    }

    .menu-text {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        font-size: 14px;
        font-weight: 600;
        color: #555;
    }
}

.mobile-menu {
    position: fixed;
    top: 35px;
    left: 0;
    right: 0;
    background: #f5f5f5;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 999;
    border-top: 1px solid #ddd;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 12px;
    border-bottom: 1px solid #eee;
    color: #555;
    transition: background 0.2s ease;
    cursor: pointer;

    &:hover {
        background: #f0f0f0;
    }
}

.menu-item.active {
    background: linear-gradient(to right, #a0c8ff, #7eb1ff);
    color: #1a4a8a;
    border-left: 3px solid #4d8de8;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(to bottom, rgba(77, 141, 232, 0.6), rgba(62, 120, 204, 0.6));
    }
}

.menu-icon {
    font-size: 18px;
    color: #888;
}

.menu-label {
    font-size: 16px;
}
</style>
