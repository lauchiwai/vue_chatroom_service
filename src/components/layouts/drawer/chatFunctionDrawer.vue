<template>
    <a-drawer
        v-model:open="open"
        placement="left"
    >
        <div class="create-bnt-container">
           <createSessionBnt :collapsed="false"/>
        </div>

        <div class="menu-container">
            <chatHistoryMenu />
        </div>

        <div class="setting-bnt-container">
            <settingBnt :collapsed="false"/>
        </div>
    </a-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import createSessionBnt from '@/components/chat/createSessionBnt.vue'
import settingBnt from '@/components/setting/settingBnt.vue'
import chatHistoryMenu  from '@/components/chatHistroy/chatHistoryMenu.vue'

const open = defineModel('open', {
    type: Boolean,
    required: true
})
</script>

<style lang="scss" scoped>
::v-deep .ant-drawer-body {
    padding: 0;
}

.create-bnt-container {
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: start;
}

.setting-bnt-container {
    height: 10%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
}

.menu-container{
    height: 80%;
}
</style>

