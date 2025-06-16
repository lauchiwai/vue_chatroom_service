<template>
    <div class="chat-header-container">
        <a-layout-header class="header">
            <div class="header-left">
                <slot name="left">
                </slot>
            </div>

            <div class="header-right">
                <slot name="right"></slot>
            </div>
        </a-layout-header>

        <slot name="drawer">
        </slot>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.chat-header-container {
    width: 100%;
}

.header {
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    min-height: 20px;
    
    .header-left {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 16px;
        
        .model-bnt {
            border: 0px;
            border-radius: 5px;
            background-color: transparent;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 40px;
            cursor: pointer;
            transition: all 0.3s;
            
            &:hover {
                background-color: #f5f5f5;
                color: #1890ff;
            }
        }
    }
}
</style>
