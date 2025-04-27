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

        <div class="bnt-container">
            <button @click="redirectToGoogleDrive" >
                查看資料集
            </button>
        </div>
    </a-drawer>
</template>
<script lang="ts" setup>
import createSessionBnt from '@/components/chatroom/createSessionBnt.vue'
import chatHistoryMenu  from '@/components/chatHistroy/chatHistoryMenu.vue'

const open = defineModel('open', {
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
    height: 80%;
}
</style>

