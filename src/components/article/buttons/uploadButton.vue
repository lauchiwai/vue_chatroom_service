<template>
    <a-button 
        type="primary" 
        class="upload-button"  
        aria-label="上傳文件"
        @click="$emit('click')"
    >
        <UploadOutlined class="upload-icon" />
    </a-button>
</template>

<script setup lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue';
</script>

<style lang="scss" scoped>
.upload-button {
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        rgba(19, 194, 194, 0.6) 0%,  
        rgba(82, 196, 26, 0.6) 100%   
    );
    border: none;
    box-shadow: 0 4px 12px rgba(19, 194, 194, 0.3);
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
        box-shadow: 0 6px 16px rgba(19, 194, 194, 0.4);
    }

    :deep(.upload-icon) {
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
