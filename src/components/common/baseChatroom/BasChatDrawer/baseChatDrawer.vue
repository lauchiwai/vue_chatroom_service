<template>
    <a-drawer
        class="chat-function-drawer"
        v-model:open="open"
        placement="left"
        :body-style="{ padding: '10px 40px' }"
    >
        <div class="create-bnt-container">
            <slot name="create-button" :closeDrawer="handleDrawerClose"></slot>
        </div>

        <div class="menu-container">
            <slot name="history-menu" :closeDrawer="handleDrawerClose"></slot>
        </div>
    </a-drawer>
</template>

<script setup lang="ts">
const open = defineModel('open', { type: Boolean, required: true })

const handleDrawerClose = () => {
  open.value = false
}
</script>

<style lang="scss" scoped>
.chat-function-drawer {
    .create-bnt-container {
        height: 10%;
        display: flex;
        align-items: center;
        justify-content: start;
    }

    .bnt-container {
        height: 50px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #f0f0f0;
        border-radius: 4px;

        button {
            border: none;
            border-radius: 2px;
            background-color: transparent;
            font-size: 18px;
            height: 80%;
            width: 80%;
            align-items: center;
            cursor: pointer;

            &:hover {
                background-color: rgb(221, 218, 218);
            }
        }
    }

    .menu-container {
        height: 80%;
    }
}
</style>
