<template>
    <a-layout-sider
        :collapsed="true"
        :trigger="null"
        :collapsedWidth="70"
        class="sidebar"
    >
        <div class="logo-container">
            <a href="/Home">
                <span class="logo-span">
                    <PictureOutlined />
                </span>
            </a>
        </div>

        <div class="side-menu-container">
            <MyMenu 
                :items="store.items"
                :selected-keys="store.selectedKeys"
                @item-click="handleItemClick"
            ></MyMenu>
        </div>
    </a-layout-sider>

    <SettingModal 
        v-if="settingOpen"
        v-model:setting-open="settingOpen"
    />
</template>

<script setup lang="ts">
import type { MenuKey } from '@/stores/siderStore';

import { PictureOutlined } from '@ant-design/icons-vue'
import { useSiderStore } from '@/stores/siderStore'
import { storeToRefs } from 'pinia'

import MyMenu from '@/components/common/myMenu.vue'
import SettingModal from '@/components/layouts/modal/settingModal.vue'

const store = useSiderStore();
const { settingOpen } = storeToRefs(store)

const handleItemClick = (key: MenuKey) => {
    store.setSelectedKeys([key]);
    store.selectEvent();
};
</script>

<style lang="scss" scoped>
.sidebar {
    --header-height: 64px;
    --setting-btn-height: 50px;

    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-right: 1px solid #f0f0f0;
    flex-shrink: 0;

    .logo-container {
        height: var(--header-height);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #f0f0f0;
        
        .logo-span{
            font-size: 30px;
            color: black;
        }
    }
}
</style>