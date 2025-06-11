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
    padding: 0 16px;
    height: 64px;
    
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
            height: 40px;
            width: 40px;
            cursor: pointer;
            transition: all 0.3s;
            
            &:hover {
                background-color: #f5f5f5;
                color: #1890ff;
            }
        }
        
        .header-action {
            padding: 0 12px;
            height: 32px;
            border-radius: 4px;
            background-color: #1890ff;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
            
            &:hover {
                background-color: #40a9ff;
                transform: translateY(-2px);
                box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
            }
        }
    }
    
    .header-right {
        display: flex;
        gap: 16px;
        align-items: center;
        
        .user-avatar {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            
            img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
            }
            
            span {
                font-weight: 500;
            }
        }
    }
}
</style>
