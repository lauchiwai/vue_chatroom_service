<template>
    <a-layout-sider
        v-model:collapsed="collapsed"
        collapsible
        :trigger="null"
        breakpoint="lg"
        width="240"
        class="sidebar"
    >
        <div class="logo-container">
            <a href="/chatroom">
                <h1 class="logo-text">{{ collapsed ? "AI" : "AI Assistant"}}</h1>
            </a>
        </div>

        <div class="create-bnt-container">
            <createSessionBnt :collapsed="collapsed"/>
        </div>

        <div class="menu-container">
            <chatHistoryMenu v-show="!collapsed"/>
        </div>

        <div class="bnt-container">
            <button @click="redirectToGoogleDrive" >
                查看資料集
            </button>
        </div>
    </a-layout-sider>
</template>

<script setup lang="ts">
import createSessionBnt from '@/components/chatroom/createSessionBnt.vue'
import chatHistoryMenu  from '@/components/chatHistroy/chatHistoryMenu.vue'

const collapsed = defineModel('collapsed', {
    type: Boolean,
    required: true
})

const redirectToGoogleDrive = () => {
    window.open(
        'https://drive.google.com/file/d/1uy7EfNAh6bB-xcKhKPl6E7jEqwodjI9s/view?usp=sharing',
        '_blank'
    );
};
</script>

<style lang="scss" scoped>
.sidebar {
    --header-height: 64px;
    --create-btn-height: 60px;
    --setting-btn-height: 50px;

    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-right: 1px solid #f0f0f0;
    flex-shrink: 0;
    transition: width 0.5s;

    .logo-container {
        height: var(--header-height);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #f0f0f0;

        .logo-text {
            color: #1890ff;
            font-size: 18px;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .create-bnt-container {
        height: var(--create-btn-height);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: start;
    }

    .bnt-container {
        height: var(--setting-btn-height);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #f0f0f0;
        border-radius: 4px;

        button{
            border: none;
            border-radius: 2px;
            background-color: transparent;
            font-size: 18px;
            height: 80%;
            width: 80%;
            align-items: center;
            cursor: pointer;
            &:hover{
                background-color: rgb(221, 218, 218);
            }
        }
    }

    .menu-container{
        height: calc(100vh - (var(--header-height) + var(--create-btn-height) + var(--setting-btn-height)));
    }
}
</style>