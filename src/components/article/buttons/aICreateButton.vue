<template>
    <a-button 
        type="primary" 
        class="ai-button"  
        aria-label="AI創建"
        @click="$emit('click')"
    >
        <RobotOutlined class="ai-icon"/>
    </a-button>
</template>

<script setup lang="ts">
import { RobotOutlined } from '@ant-design/icons-vue';
</script>

<style lang="scss" scoped>
.ai-button {
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        rgba(24, 144, 255, 0.6) 0%,  
        rgba(114, 46, 209, 0.6) 100%
    );
    border: none;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    transition: all 0.3s ease;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    
    @media (max-width: 768px) {
        min-width: 80px;
        min-height: 80px;
    }

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
    }

    :deep(.ai-icon) {
        display: block;
        width: 60%;
        height: 60%;
        
        svg {
            display: block;
            width: 100%;
            height: 100%;
            fill: currentColor;
        }
    }
}
</style>
