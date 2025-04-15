<template>
    <a-drawer
        class="chat-function-drawer"
        v-model:open="open"
        placement="left"
        :body-style="{ padding: '10px 40px' }"
    >
        <div class="create-bnt-container">
            <createSessionBnt :collapsed="false" @drawer-close="open = false"/>
        </div>

        <div class="menu-container">
            <chatHistoryMenu  @drawer-close="open = false"/>
        </div>

        <div class="setting-bnt-container">
        </div>
    </a-drawer>
</template>
<script lang="ts" setup>
import createSessionBnt from '@/components/chat/createSessionBnt.vue'
import chatHistoryMenu  from '@/components/chatHistroy/chatHistoryMenu.vue'

const open = defineModel('open', {
    type: Boolean,
    required: true
})
</script>

<style lang="scss" scoped>
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

