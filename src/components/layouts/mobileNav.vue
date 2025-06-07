<template>
    <nav class="tab-bar">
        <div class="tab-bar-content">
            <MobileNavTabItem 
                v-for="item in store.items"
                :key="item.key"
                :item="item"
                :selected-keys="store.selectedKeys"
                @item-click="handleItemClick"
            />
        </div>
    </nav>

    <SettingModal 
        v-model:setting-open="settingOpen"
    />
</template>

<script setup lang="ts">
import { useSiderStore } from '@/stores/siderStore';
import { storeToRefs } from 'pinia'

import MobileNavTabItem from '@/components/common/mobileNavTabItem.vue'; 
import SettingModal from '@/components/layouts/modal/settingModal.vue'

const store = useSiderStore();
const { settingOpen } = storeToRefs(store)

const handleItemClick = (key: string) => {
    store.setSelectedKeys([key]);
    store.selectEvent();
};
</script>

<style scoped>
.tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e0e0e0;
    padding: 4px 0;
    z-index: 100;
}

.tab-bar-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
}
</style>